// src/routes/users.js
import express from 'express';
import { User, validate } from '../models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      ...req.body,
      password: hashPassword,
      role: req.body.role || 'patient', // Set role to user by default or use provided role
    });

    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ token, email: user.email, _id: user._id, role: user.role });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

export default router;

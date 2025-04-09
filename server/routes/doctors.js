// src/routes/doctors.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Doctor, validateDoctor } from '../models/Doctor.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { error } = validateDoctor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) return res.status(400).send('Doctor already registered.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    doctor = new Doctor({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      specialization: req.body.specialization,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      consultationFees: req.body.consultationFees,
      availability: req.body.availability,
      patientsInLine: req.body.patients,
      role: 'doctor' // Set the role to doctor
    });

    await doctor.save();
    res.status(200).send('Doctor registered successfully.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/login', async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ email: req.body.email });
    if (!doctor) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, doctor.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign(
      { _id: doctor._id, role: doctor.role }, // Include role in token
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '7d' }
    );
    res.header('x-auth-token', token).send({ token, email: doctor.email, _id: doctor._id, role: doctor.role });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }
    res.send(doctor);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

router.put('/:id/availability', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { days, timeslots, patientsInLine } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { availability: { days, timeslots }, patientsInLine: patientsInLine },
      { new: true }
    );
    
    if (!updatedDoctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    res.send(updatedDoctor);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

router.get('/:id/patients', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { patientsInLine } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate( doctorId, { patientsInLine }, { new: true });

    if (!updatedDoctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    res.send(updatedDoctor);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

export default router;

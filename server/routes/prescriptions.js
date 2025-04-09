import express from 'express';
import { Prescription, validatePrescription } from '../models/Prescription.js';
import { User } from '../models/user.js';
import { Doctor } from '../models/Doctor.js';

const router = express.Router();

// Create a new prescription
router.post('/', async (req, res) => {
  const { error } = validatePrescription(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { patientId, doctorId, diagnosis, medication, instructions } = req.body;

  let prescription = new Prescription({
    patientId,
    doctorId,
    diagnosis,
    medication,
    instructions
  });

  try {
    prescription = await prescription.save();
    res.status(201).send(prescription);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get prescriptions by patient email
router.get('/bypatientemail', async (req, res) => {
  const { email } = req.query;
  try {
    const patient = await User.findOne({ email });
    if (!patient) return res.status(404).send('Patient not found');

    const prescriptions = await Prescription.find({ patientId: patient._id });
    res.status(200).send(prescriptions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;

// src/models/Doctor.js
import mongoose from 'mongoose';
import Joi from 'joi';

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  consultationFees: { type: Number, required: true },
  availability: {
    days: [String],
    timeslots: [String],
  },
  patientsInLine: { type: Number, default: 0 },
  role: { type: String, default: 'doctor' },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

const validateDoctor = (doctor) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    specialization: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    consultationFees: Joi.number().required(),
    availability: Joi.object({
      days: Joi.array().items(Joi.string()),
      timeslots: Joi.array().items(Joi.string()),
    patientsInLine: Joi.number(),
    
    }),
  });

  return schema.validate(doctor);
};

export { Doctor, validateDoctor };

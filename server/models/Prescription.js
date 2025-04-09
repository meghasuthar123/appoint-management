import mongoose from 'mongoose';
import Joi from 'joi';

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  diagnosis: { type: String, required: true },
  medication: { type: String, required: true },
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

const validatePrescription = (prescription) => {
  const schema = Joi.object({
    patientId: Joi.string().required(),
    doctorId: Joi.string().required(),
    diagnosis: Joi.string().required(),
    medication: Joi.string().required(),
    instructions: Joi.string().required(),
  });

  return schema.validate(prescription);
};

export { Prescription, validatePrescription };

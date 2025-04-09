// src/routes/appointments.js
import express from "express";
import Appointment from "../models/appointment.js";
import { Doctor } from "../models/Doctor.js";

const router = express.Router();

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    console.log(appointment);
    await appointment.save();
    res.status(201).send({ message: "Appointment booked successfully!" });
  } catch (error) {
    res.status(400).send({ message: "Error booking appointment", error });
  }
});

// Get all appointments (optional, if you need this for admin purposes)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorEmail");
    res.status(200).send(appointments);
  } catch (error) {
    res.status(400).send({ message: "Error fetching appointments", error });
  }
});

// passed docid as querryt from client
router.get("/bydoctor", async (req, res) => {
  console.log(req.query);
  const doctorid = req.query.docid;

  try {
    const doctor = await Doctor.findById(doctorid);
    const appointments = await Appointment.find({ doctorEmail: doctorid });
    res.status(200).send(appointments);
  } catch (error) {
    res.status(400).send({ message: "Error fetching appointments", error });
  }
});

// route which the user will use to get his upcoing and current appointments
router.get("/byuser", async (req, res) => {
  console.log(req.query);
  const user_id = req.query.userid;

  try {
    const appointments = await Appointment.find({ userId: user_id });
    let appointmentsWithDoctorDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctorEmail);
        return { ...appointment._doc, doctor };
      })
    );
    res.status(200).send(appointmentsWithDoctorDetails);


  } catch (error) {
    res.status(400).send({ message: "Error fetching appointments", error });
  }
});

export default router;

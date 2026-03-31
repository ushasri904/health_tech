const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

/* ---------- DATABASE ---------- */
mongoose.connect('mongodb://127.0.0.1:27017/healthcare')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ---------- MODELS ---------- */
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String
});

const Doctor = mongoose.model('Doctor', {
  name: String,
  specialization: String,
  experience: Number,
  rating: Number
});

const Appointment = mongoose.model('Appointment', {
  userId: String,
  doctorId: String,
  date: String
});

/* ---------- ROUTES ---------- */

// Test
app.get('/', (req, res) => {
  res.send("Backend Running");
});

// Register
app.post('/api/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("User Registered");
});

// Login
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || user.password !== req.body.password) {
    return res.status(400).send("Invalid Credentials");
  }

  res.send("Login Success");
});

// Add Doctor
app.post('/api/doctors', async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.send("Doctor Added");
});

// Recommend Doctor
app.get('/api/doctors/recommend', async (req, res) => {
  const { specialization } = req.query;

  const doctors = await Doctor.find({ specialization })
    .sort({ rating: -1, experience: -1 })
    .limit(3);

  res.json(doctors);
});

// Book Appointment
app.post('/api/appointments', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.send("Appointment Booked");
});

// Report Analysis (basic logic)
app.post('/api/analyze', (req, res) => {
  const { text } = req.body;

  let result = "Normal";

  if (text.includes("sugar")) result = "Diabetes Risk";
  if (text.includes("bp")) result = "Blood Pressure Risk";

  res.json({ result });
});

/* ---------- SERVER ---------- */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  About, Project, Experience, Course, Mentorship, 
  MentorshipSlot, Booking, Registration, Message 
} from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amgad_portfolio';

// Authorized Production Origins
const allowedOrigins = [
  'http://amgad.design',
  'https://amgad.design',
  'http://www.amgad.design',
  'https://www.amgad.design',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ Blocked request from unauthorized origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Engine'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// --- API GATEWAY ---

// Bulk Data Aggregator
app.get('/api/portfolio', async (req, res) => {
  try {
    const [about, projects, experiences, courses, mentorship, slots, bookings, registrations, messages] = await Promise.all([
      About.findOne(),
      Project.find(),
      Experience.find(),
      Course.find(),
      Mentorship.find(),
      MentorshipSlot.find(),
      Booking.find().sort({ timestamp: -1 }),
      Registration.find().sort({ date: -1 }),
      Message.find().sort({ date: -1 })
    ]);
    res.json({ 
      about: about || { title: '', summary: '', philosophy: '' }, 
      projects, 
      experiences, 
      courses, 
      mentorship, 
      slots, 
      bookings, 
      registrations, 
      messages 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Identity Management
app.post('/api/about', async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Works Archive
app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Timeline
app.post('/api/experiences', async (req, res) => {
  try {
    const exp = await Experience.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experiences/:id', async (req, res) => {
  try {
    await Experience.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Academy Modules
app.post('/api/courses', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mentorship Sessions
app.post('/api/mentorship', async (req, res) => {
  try {
    const session = await Mentorship.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/mentorship/:id', async (req, res) => {
  try {
    await Mentorship.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scheduling System
app.post('/api/slots', async (req, res) => {
  try {
    const slot = await MentorshipSlot.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/slots/:id', async (req, res) => {
  try {
    await MentorshipSlot.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions & Inquiries
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    await MentorshipSlot.findOneAndUpdate({ id: req.body.slotId }, { status: 'booked' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate({ id: req.params.id }, { status: 'read' }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Amgad Design Backend Active on port ${PORT}`);
});

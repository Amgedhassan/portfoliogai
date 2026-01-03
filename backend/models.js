import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: String,
  summary: String,
  philosophy: String,
  image: String,
});

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  longDescription: String,
  challenge: String,
  solution: String,
  impact: String,
  image: String,
  role: String,
  timeline: String,
  tools: [String],
  tags: [String],
  isFeatured: Boolean,
  showCaseStudy: { type: Boolean, default: true },
  behanceUrl: String,
  outcomes: [{ label: String, value: String, description: String }]
});

const ExperienceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  role: String,
  company: String,
  period: String,
  description: [String]
});

const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  fullDescription: String,
  type: { type: String, enum: ['external', 'session'] },
  platform: String,
  url: String,
  price: Number,
  priceEGP: Number,
  currency: String,
  duration: String,
  date: String,
  image: String,
  skills: [String],
  curriculum: [{ title: String, description: String }]
});

const MentorshipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  duration: String,
  description: String,
  topics: [String],
  price: Number,
  priceEGP: Number
});

const MentorshipSlotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  dateTime: String,
  endTime: String,
  status: { type: String, enum: ['available', 'locked', 'booked'], default: 'available' },
  sessionId: String,
  price: Number
});

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slotId: String,
  sessionId: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  amount: Number,
  currency: { type: String, enum: ['USD', 'EGP'], default: 'USD' },
  paymentRef: String,
  paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
  timestamp: String,
  paymentReceipt: String
});

const RegistrationSchema = new mongoose.Schema({
  id: String,
  courseId: String,
  courseTitle: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  date: String,
  status: { type: String, default: 'confirmed' },
  selectedCurrency: { type: String, enum: ['USD', 'EGP'], default: 'USD' },
  paidAmount: Number,
  paymentReceipt: String
});

const MessageSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  message: String,
  date: String,
  status: { type: String, default: 'new' }
});

export const About = mongoose.model('About', AboutSchema);
export const Project = mongoose.model('Project', ProjectSchema);
export const Experience = mongoose.model('Experience', ExperienceSchema);
export const Course = mongoose.model('Course', CourseSchema);
export const Mentorship = mongoose.model('Mentorship', MentorshipSchema);
export const MentorshipSlot = mongoose.model('MentorshipSlot', MentorshipSlotSchema);
export const Booking = mongoose.model('Booking', BookingSchema);
export const Registration = mongoose.model('Registration', RegistrationSchema);
export const Message = mongoose.model('Message', MessageSchema);
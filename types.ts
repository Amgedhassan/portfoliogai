export interface CaseStudyOutcome {
  label: string;
  value: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  process?: { step: string; description: string }[];
  tags: string[];
  impact: string;
  image: string;
  role: string;
  timeline: string;
  tools: string[];
  isFeatured?: boolean;
  showCaseStudy?: boolean;
  audience?: string;
  researchInsights?: string[];
  outcomes?: CaseStudyOutcome[];
  lessonsLearned?: string[];
  behanceUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
}

export interface CurriculumItem {
  title: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: 'external' | 'session';
  platform?: string;
  url?: string;
  price: number;
  priceEGP?: number; // Optional Egyptian Pound price
  currency: string;
  date?: string;
  duration: string;
  image: string;
  skills: string[];
  instructor: string;
  curriculum?: CurriculumItem[];
}

export interface Registration {
  id: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  status: 'pending' | 'confirmed';
  selectedCurrency: 'USD' | 'EGP';
  paidAmount: number;
  paymentReceipt?: string; // Base64 or URL of the screenshot
}

export interface MentorshipSession {
  id: string;
  title: string;
  duration: string; // e.g. "60 Mins"
  description: string;
  topics: string[];
  price: number;
  priceEGP?: number;
}

export interface MentorshipSlot {
  id: string;
  dateTime: string; // ISO string (UTC)
  endTime: string;  // ISO string (UTC)
  status: 'available' | 'locked' | 'booked';
  sessionId: string;
  price: number;
}

export interface Booking {
  id: string;
  slotId: string;
  sessionId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  currency: 'USD' | 'EGP';
  paymentRef: string;
  paymentStatus: 'paid' | 'pending';
  timestamp: string;
  paymentReceipt?: string; // Base64 or URL of the screenshot
}

export interface Skill {
  name: string;
  category: 'core' | 'tool';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'archived';
}

export interface PortfolioData {
  about: {
    title: string;
    summary: string;
    philosophy: string;
    image?: string;
  };
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  courses: Course[];
  registrations: Registration[];
  mentorship: MentorshipSession[];
  slots: MentorshipSlot[];
  bookings: Booking[];
  messages: ContactMessage[];
}

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type View = 
  | { type: 'home'; anchor?: string }
  | { type: 'project'; data: Project }
  | { type: 'course_detail'; data: Course }
  | { type: 'about' }
  | { type: 'mentorship' }
  | { type: 'mentorship_booking'; session: MentorshipSession }
  | { type: 'login' }
  | { type: 'dashboard' }
  | { type: 'gallery' }
  | { type: 'courses' };
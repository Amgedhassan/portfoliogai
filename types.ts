
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
  platform?: string; // e.g. 'Udemy', 'YouTube', 'Zoom'
  url?: string; // for external
  price: number; // 0 for free
  currency: string;
  date?: string; // for sessions
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
  date: string;
  status: 'pending' | 'confirmed';
}

export interface MentorshipSession {
  id: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
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
  };
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  courses: Course[];
  registrations: Registration[];
  mentorship: MentorshipSession[];
  messages: ContactMessage[];
}

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

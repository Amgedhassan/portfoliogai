
import { PortfolioData, Project, Experience, MentorshipSession, ContactMessage, Course, Registration } from './types';
import { PROJECTS, EXPERIENCES, CERTIFICATIONS, MENTORSHIP_SESSIONS, PERSONAL_INFO, COURSES } from './constants';

// Determine the API URL based on where the code is running
const isProd = window.location.hostname !== 'localhost';
const API_BASE = isProd ? 'https://amgadsrvr.amgad.design/api' : '/api'; 

const STORAGE_KEY = 'amgad_portfolio_data_v4';

const INITIAL_DATA: PortfolioData = {
  about: {
    title: PERSONAL_INFO.title,
    summary: PERSONAL_INFO.summary,
    philosophy: "Empathy-Driven Efficiency: Designing tools that respect the user's time and cognitive load."
  },
  projects: PROJECTS,
  experiences: EXPERIENCES,
  certifications: CERTIFICATIONS,
  courses: COURSES,
  registrations: [],
  mentorship: MENTORSHIP_SESSIONS,
  messages: []
};

function safeJsonParse(str: string | null): any {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (e) { return null; }
}

export const DataService = {
  checkConnection: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch { return false; }
  },

  getData: async (): Promise<PortfolioData> => {
    try {
      const response = await fetch(`${API_BASE}/portfolio`);
      if (response.ok) {
        const data = await response.json();
        return { ...INITIAL_DATA, ...data };
      }
    } catch (e) { console.warn("Using offline fallback."); }
    return safeJsonParse(localStorage.getItem(STORAGE_KEY)) || INITIAL_DATA;
  },

  saveData: async (data: PortfolioData): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    try {
      await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Cloud sync failed.");
    } finally {
      window.dispatchEvent(new Event('portfolio-updated'));
    }
  },

  updateAbout: async (about: PortfolioData['about']): Promise<void> => {
    const data = await DataService.getData();
    data.about = about;
    await DataService.saveData(data);
  },

  saveProject: async (project: Project): Promise<void> => {
    const data = await DataService.getData();
    const index = (data.projects || []).findIndex(p => p.id === project.id);
    if (index > -1) data.projects[index] = project;
    else data.projects.push(project);
    await DataService.saveData(data);
  },

  deleteProject: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    data.projects = (data.projects || []).filter(p => p.id !== id);
    await DataService.saveData(data);
  },

  saveExperience: async (exp: Experience): Promise<void> => {
    const data = await DataService.getData();
    const index = (data.experiences || []).findIndex(e => e.id === exp.id);
    if (index > -1) data.experiences[index] = exp;
    else data.experiences.push(exp);
    await DataService.saveData(data);
  },

  deleteExperience: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    data.experiences = (data.experiences || []).filter(e => e.id !== id);
    await DataService.saveData(data);
  },

  saveCourse: async (course: Course): Promise<void> => {
    const data = await DataService.getData();
    const index = (data.courses || []).findIndex(c => c.id === course.id);
    if (index > -1) data.courses[index] = course;
    else data.courses.push(course);
    await DataService.saveData(data);
  },

  deleteCourse: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    data.courses = (data.courses || []).filter(c => c.id !== id);
    await DataService.saveData(data);
  },

  saveMentorship: async (session: MentorshipSession): Promise<void> => {
    const data = await DataService.getData();
    const index = (data.mentorship || []).findIndex(m => m.id === session.id);
    if (index > -1) data.mentorship[index] = session;
    else data.mentorship.push(session);
    await DataService.saveData(data);
  },

  deleteMentorship: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    data.mentorship = (data.mentorship || []).filter(m => m.id !== id);
    await DataService.saveData(data);
  },

  addRegistration: async (reg: Omit<Registration, 'id' | 'date' | 'status'>): Promise<void> => {
    const data = await DataService.getData();
    const newReg: Registration = {
      ...reg,
      id: `reg-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      status: 'confirmed'
    };
    data.registrations = data.registrations || [];
    data.registrations.unshift(newReg);
    await DataService.saveData(data);
  },

  addMessage: async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>): Promise<void> => {
    const data = await DataService.getData();
    const newMessage: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: 'new'
    };
    data.messages = data.messages || [];
    data.messages.unshift(newMessage);
    await DataService.saveData(data);
  },

  markMessageAsRead: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    const msg = (data.messages || []).find(m => m.id === id);
    if (msg) msg.status = 'read';
    await DataService.saveData(data);
  },

  deleteMessage: async (id: string): Promise<void> => {
    const data = await DataService.getData();
    data.messages = (data.messages || []).filter(m => m.id !== id);
    await DataService.saveData(data);
  }
};

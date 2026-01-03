
import { 
  PortfolioData, Project, Experience, MentorshipSession, 
  ContactMessage, Course, Registration, MentorshipSlot, Booking 
} from './types.ts';
import { 
  PERSONAL_INFO, PROJECTS, COURSES, EXPERIENCES, 
  MENTORSHIP_SESSIONS 
} from './constants.tsx';

// Production API Gateway
const BACKEND_URL = 'https://amgadsrvr.amgad.design/api';

/**
 * Constructs the default portfolio state from static constants.
 * This acts as our safety net when the database is offline.
 */
const getFallbackData = (): PortfolioData => ({
  about: {
    title: PERSONAL_INFO.title,
    summary: PERSONAL_INFO.summary,
    philosophy: "Design with intent. Scale with logic."
  },
  projects: PROJECTS,
  experiences: EXPERIENCES,
  certifications: [],
  courses: COURSES,
  registrations: [],
  mentorship: MENTORSHIP_SESSIONS,
  slots: [],
  bookings: [],
  messages: []
});

const fetchApi = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API Request Failed: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const DataService = {
  checkConnection: async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BACKEND_URL}/portfolio`, { 
        method: 'HEAD',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  getData: async (): Promise<PortfolioData> => {
    try {
      return await fetchApi('/portfolio');
    } catch (err) {
      console.warn("⚠️ DataService: Production backend unreachable. Falling back to static assets.", err);
      return getFallbackData();
    }
  },

  updateAbout: async (about: PortfolioData['about']): Promise<void> => {
    try {
      await fetchApi('/about', {
        method: 'POST',
        body: JSON.stringify(about),
      });
    } catch (err) {
      console.error("Failed to update about in DB", err);
    }
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  getAvailableSlots: async (sessionId: string): Promise<MentorshipSlot[]> => {
    try {
      const data: PortfolioData = await fetchApi('/portfolio');
      const now = new Date();
      return data.slots.filter(s => 
        s.sessionId === sessionId && 
        s.status === 'available' && 
        new Date(s.dateTime) > now
      );
    } catch {
      return [];
    }
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'timestamp' | 'paymentStatus' | 'paymentRef'>): Promise<Booking> => {
    const newBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      paymentRef: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      paymentStatus: 'paid' as const
    };
    
    try {
      return await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify(newBooking),
      });
    } catch {
      window.dispatchEvent(new Event('portfolio-updated'));
      return newBooking as Booking;
    }
  },

  saveSlot: async (slot: MentorshipSlot): Promise<void> => {
    try {
      await fetchApi('/slots', {
        method: 'POST',
        body: JSON.stringify(slot),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteSlot: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/slots/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  saveProject: async (project: Project): Promise<void> => {
    try {
      await fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/projects/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  saveExperience: async (exp: Experience): Promise<void> => {
    try {
      await fetchApi('/experiences', {
        method: 'POST',
        body: JSON.stringify(exp),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteExperience: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/experiences/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  addMessage: async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>): Promise<void> => {
    const newMessage = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: 'new' as const
    };
    try {
      await fetchApi('/messages', {
        method: 'POST',
        body: JSON.stringify(newMessage),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  addRegistration: async (reg: Omit<Registration, 'id' | 'date' | 'status'>): Promise<void> => {
    const newReg = {
      ...reg,
      id: `reg-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      status: 'confirmed' as const
    };
    try {
      await fetchApi('/registrations', {
        method: 'POST',
        body: JSON.stringify(newReg),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  markMessageAsRead: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/messages/${id}/read`, { method: 'PATCH' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteMessage: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/messages/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },
  
  saveCourse: async (course: Course): Promise<void> => {
    try {
      await fetchApi('/courses', {
        method: 'POST',
        body: JSON.stringify(course),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/courses/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  saveMentorshipSession: async (session: MentorshipSession): Promise<void> => {
    try {
      await fetchApi('/mentorship', {
        method: 'POST',
        body: JSON.stringify(session),
      });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  },

  deleteMentorshipSession: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/mentorship/${id}`, { method: 'DELETE' });
    } catch {}
    window.dispatchEvent(new Event('portfolio-updated'));
  }
};

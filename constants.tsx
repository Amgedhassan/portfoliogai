
import { Project, Experience, Certification, Skill, MentorshipSession, Course } from './types.ts';

export const PERSONAL_INFO = {
  name: 'Amgad Hassan',
  title: 'Strategic Product Designer (UX/UI)',
  summary: 'Architecting high-performance digital products for global enterprises and high-growth startups. Specializing in turning complex requirements into intuitive, revenue-driving B2B experiences and scalable design systems.',
  email: 'amgedhassan@outlook.com',
  linkedin: 'https://www.linkedin.com/in/amgad-hassan-243248145',
  behance: 'https://www.behance.net/amgedhassan'
};

export const PROJECTS: Project[] = [
  {
    id: 'enterprise-ops',
    title: 'Enterprise Workflow Optimization',
    description: 'A global B2B ticket dispatching platform that cut technical labor costs by €1.2M annually.',
    longDescription: 'Redesigning the core operational tool for Vodafone’s internal teams across 12+ European markets. The goal was to replace fragmented legacy software with a high-density, centralized monitoring system that maximizes operator efficiency.',
    challenge: 'A 20% ticket duplication rate was causing service delays and wasting millions in operational overhead.',
    solution: 'Engineered a smart-priority dashboard and a comprehensive B2B design system optimized for high-intensity monitoring and rapid triage.',
    audience: 'Enterprises needing high-density data management and operational efficiency.',
    researchInsights: [
      'Dispatchers wasted 40% of time deduplicating data.',
      'Legacy tools had a 3-month learning curve, now reduced to 3 weeks.'
    ],
    outcomes: [
      { label: 'Efficiency', value: '95%', description: 'Reduction in manual errors.' },
      { label: 'Cost Savings', value: '€1.2M', description: 'Estimated annual ROI.' },
      { label: 'Training', value: '-75%', description: 'Faster onboarding time.' }
    ],
    lessonsLearned: [
      'Enterprise design is about clarity over cleverness.',
      'Design systems are the ultimate force-multiplier for large engineering teams.'
    ],
    process: [
      { step: 'Audit', description: 'Mapped the "Chaos Path" of 15 legacy tools.' },
      { step: 'Logic', description: 'Created a priority-based triage system.' },
      { step: 'Scale', description: 'Built a multi-brand design system.' }
    ],
    impact: 'Saved €1.2M/year and increased operator speed by 40%.',
    tags: ['Enterprise', 'SaaS', 'B2B'],
    image: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=2070&auto=format&fit=crop',
    role: 'Lead Product Designer',
    timeline: '12 Months',
    tools: ['Figma', 'React', 'Agile'],
    isFeatured: true
  },
  {
    id: 'startup-launch',
    title: 'SaaS MVP Velocity Launch',
    description: 'Transforming a complex fintech idea into a funding-ready SaaS MVP in under 8 weeks.',
    longDescription: 'Worked with a stealth-mode startup to define their product-market fit through rapid prototyping and high-fidelity UI design. The focus was on securing Seed funding through a premium, frictionless user experience.',
    challenge: 'The founders had the backend logic but no interface to pitch to investors or early beta users.',
    solution: 'Designed a lean, iterative MVP focused on the core value proposition, ensuring a polished "premium" feel to secure investor trust.',
    impact: 'Helped secure $2.5M in Seed funding through high-fidelity interactive prototypes.',
    tags: ['Startup', 'Fintech', 'Rapid MVP'],
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop',
    role: 'Fractional Head of Design',
    timeline: '8 Weeks',
    tools: ['Figma', 'Protopie', 'Webflow'],
    isFeatured: true
  }
];

export const COURSES: Course[] = [
  {
    id: 'b2b-mastery',
    title: 'B2B Design Mastery',
    description: 'The blueprint for designing high-density data platforms and enterprise SaaS.',
    fullDescription: 'Learn how to handle complexity at scale. This course covers everything from multi-persona workflows to design system governance for global products. We deep dive into how to reduce cognitive load in data-heavy environments.',
    type: 'session',
    price: 249,
    currency: 'USD',
    platform: 'Product Academy Live',
    duration: '4 Weeks',
    date: 'Oct 15, 2025',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=2070&auto=format&fit=crop',
    skills: ['B2B Logic', 'Data Viz', 'Design Ops'],
    instructor: 'Amgad Hassan',
    curriculum: [
      { title: 'The B2B Mindset', description: 'Why B2B UX differs from consumer products.' },
      { title: 'Information Architecture for Density', description: 'Handling 1000+ data points on one screen.' },
      { title: 'Design System Governance', description: 'Scaling components across multi-product suites.' }
    ]
  },
  {
    id: 'mvp-fast-track',
    title: 'MVP Fast-Track for Founders',
    description: 'A 2-week intensive on building funding-ready prototypes.',
    fullDescription: 'Perfect for non-technical founders or solo designers. Learn the exact workflow I use to go from a Napkin Sketch to a high-fidelity Investor Prototype in record time.',
    type: 'external',
    url: 'https://behance.net/amgedhassan',
    price: 0,
    currency: 'USD',
    platform: 'On-Demand',
    duration: '10 Lessons',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop',
    skills: ['Prototyping', 'Visual Storytelling', 'Lean UX'],
    instructor: 'Amgad Hassan'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-vois',
    role: 'Senior Product Designer',
    company: 'Vodafone Intelligent Solutions',
    period: '2021–Present',
    description: [
      'Leading design for the Vodafone Planner, used by dispatching teams across 12 EU markets.',
      'Saving €1.2M annually through workflow consolidation and technical debt reduction.',
      'Consulting on internal Design Systems for 500+ developers.'
    ]
  },
  {
    id: 'exp-freelance',
    role: 'Fractional Product Lead',
    company: 'Stealth SaaS & Fintechs',
    period: '2019–2021',
    description: [
      'Helped 5+ startups secure seed funding through high-fidelity UX prototyping.',
      'Audited legacy B2B dashboards to improve conversion by 30%.'
    ]
  }
];

export const MENTORSHIP_SESSIONS: MentorshipSession[] = [
  {
    id: 'portfolio-audit',
    title: 'High-Impact Portfolio Audit',
    duration: '60 Mins',
    price: 150,
    description: 'For mid-level designers who want to transition into high-paying B2B roles. We fix your case studies to focus on ROI and logic.',
    topics: ['Case Study Narrative', 'Enterprise UX Presentation', 'Negotiating Rates']
  },
  {
    id: 'strategic-logic',
    title: 'Design Logic & ROI Strategy',
    duration: '90 Mins',
    price: 250,
    description: 'Master the art of presenting design as a business value multiplier. Perfect for leads and seniors presenting to C-suite.',
    topics: ['Stakeholder Alignment', 'ROI Frameworks', 'B2B Complexity Management']
  }
];

export const SKILLS: Skill[] = [
  { name: 'Strategic UX', category: 'core' },
  { name: 'Design Systems', category: 'core' },
  { name: 'B2B SaaS', category: 'core' },
  { name: 'Figma Mastery', category: 'tool' }
];

export const CERTIFICATIONS: Certification[] = [
  { 
    id: 'iti-ux',
    name: 'User Experience Specialization', 
    issuer: 'ITI Egypt', 
    date: '2021',
    description: 'Post-graduate intensive on full-stack product design.',
    skills: ['User Research', 'Usability Testing', 'Service Design']
  }
];

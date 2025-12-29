
export enum JobRole {
  IT = 'IT / Software Engineer',
  SALES = 'Sales & Marketing',
  SUPPORT = 'Customer Support / BPO',
  FRESHER = 'Fresher (Any Graduate)',
  FINANCE = 'Finance & Accounting',
  HR = 'HR & Recruitment',
  DIGITAL_MARKETING = 'Digital Marketing & SEO',
  DATA = 'Data Analyst / Scientist',
  PROJECT_MGMT = 'Project Management',
  TEACHING = 'Teaching & Education',
  HEALTHCARE = 'Healthcare / Nursing',
  CIVIL = 'Civil Engineering',
  MECHANICAL = 'Mechanical Engineering',
  DESIGN = 'Graphic & UI/UX Design',
  CONTENT = 'Content Writing / Journalism',
  HOSPITALITY = 'Hotel Management & Hospitality',
  LEGAL = 'Legal / Law Professional',
  OPERATIONS = 'Operations & Supply Chain',
  BANKING = 'Banking & Insurance',
  DATA_ENTRY = 'Data Entry Operator',
  DELIVERY = 'Delivery Partner / Executive',
  DRIVER = 'Professional Driver',
  RECEPTIONIST = 'Receptionist / Front Desk',
  TECHNICIAN = 'Technician / Electrician',
  DIPLOMA_ENTRY = 'Diploma (Entry Level)',
  SECURITY = 'Security Staff',
  OFFICE_STAFF = 'Office Staff / Peon'
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobRole: JobRole;
  education: {
    degree: string;
    college: string;
    year: string;
    percentage: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  summary?: string;
  refinementFeedback?: string; // For AI-based edits
}

export interface DocumentResult {
  resumeSummary: string;
  experienceBullets: string[][];
  coverLetter: string;
  linkedinSummary: string;
  linkedinHeadline: string;
  // Premium Features
  keywordMapping?: string[];
  atsExplanation?: string;
  recruiterInsights?: string;
  // Quota Management
  remainingCredits?: number;
}

export enum PackageType {
  RESUME_ONLY = 'RESUME_ONLY',
  RESUME_COVER = 'RESUME_COVER',
  JOB_READY_PACK = 'JOB_READY_PACK'
}

import { JobRole, PackageType } from './types';

// Pulls from Vercel Environment Variables or vite.config.ts 'define'
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_fallback_key';

export const PRICING = {
  [PackageType.RESUME_ONLY]: { 
    price: 99, 
    label: 'Starter Pack',
    features: ['1 Professional Resume', 'ATS-Friendly Layout', 'Instant PDF Download', 'Indian Market Optimized']
  },
  [PackageType.RESUME_COVER]: { 
    price: 199, 
    label: 'Pro Pack',
    features: ['3 Generation Credits', 'Resume + Cover Letter', 'Clean Layouts', 'Priority PDF Export']
  },
  [PackageType.JOB_READY_PACK]: { 
    price: 299, 
    label: 'Job Ready Pack',
    features: [
      'Everything in Pro Pack',
      'LinkedIn About Section',
      'Recruiter Keyword Mapping',
      'ATS Score Explanation',
      'Recruiter Advice Insights',
      'No Watermark'
    ]
  },
};

export const ROLE_TEMPLATES: Record<JobRole, string> = {
  [JobRole.IT]: "Focus on technical stack, projects, and certifications.",
  [JobRole.SALES]: "Focus on targets achieved, communication, and networking.",
  [JobRole.SUPPORT]: "Focus on problem solving, empathy, and shift flexibility.",
  [JobRole.FRESHER]: "Focus on internships, academic projects, and extracurriculars.",
  [JobRole.FINANCE]: "Focus on accuracy, accounting standards, and tools like Tally.",
  [JobRole.HR]: "Focus on talent acquisition, employee relations, and HR policies.",
  [JobRole.DIGITAL_MARKETING]: "Focus on SEO, social media metrics, and campaign ROI.",
  [JobRole.DATA]: "Focus on SQL, Python, visualization, and analytical projects.",
  [JobRole.PROJECT_MGMT]: "Focus on agile methodologies, stakeholder management, and delivery.",
  [JobRole.TEACHING]: "Focus on curriculum development, classroom management, and results.",
  [JobRole.HEALTHCARE]: "Focus on patient care, clinical skills, and certifications.",
  [JobRole.CIVIL]: "Focus on site management, CAD tools, and project execution.",
  [JobRole.MECHANICAL]: "Focus on manufacturing processes, design tools, and maintenance.",
  [JobRole.DESIGN]: "Focus on portfolio links, design tools, and creative process.",
  [JobRole.CONTENT]: "Focus on writing style, SEO awareness, and published works.",
  [JobRole.HOSPITALITY]: "Focus on guest satisfaction, service standards, and front office.",
  [JobRole.LEGAL]: "Focus on legal research, case handling, and documentation.",
  [JobRole.OPERATIONS]: "Focus on process efficiency, logistics, and cost reduction.",
  [JobRole.BANKING]: "Focus on customer relations, product knowledge, and financial compliance.",
  [JobRole.DATA_ENTRY]: "Focus on typing speed, accuracy, MS Office proficiency, and reliability.",
  [JobRole.DELIVERY]: "Focus on punctuality, location familiarity, and customer handling.",
  [JobRole.DRIVER]: "Focus on driving license types, safe driving record, and route knowledge.",
  [JobRole.RECEPTIONIST]: "Focus on grooming, greeting skills, telephone etiquette, and office management.",
  [JobRole.TECHNICIAN]: "Focus on technical repairs, safety compliance, and troubleshooting.",
  [JobRole.DIPLOMA_ENTRY]: "Focus on specialized vocational training, practical projects, and technical skills.",
  [JobRole.SECURITY]: "Focus on physical fitness, vigilance, and security protocols.",
  [JobRole.OFFICE_STAFF]: "Focus on multitasking, office equipment usage, and helpful attitude."
};

export const SAMPLE_SKILLS = [
  "Communication", "Teamwork", "MS Office", "Time Management", "Problem Solving"
];
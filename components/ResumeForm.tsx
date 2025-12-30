
import React, { useState } from 'react';
import { JobRole, UserData } from '../types';

interface Props {
  onSubmit: (data: UserData & { botCheck?: string }) => void;
  isLoading: boolean;
  initialData?: UserData | null;
}

const ResumeForm: React.FC<Props> = ({ onSubmit, isLoading, initialData }) => {
  const [step, setStep] = useState(1);
  const [botCheck, setBotCheck] = useState(''); // Honeypot field
  const [formData, setFormData] = useState<UserData>(initialData || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobRole: JobRole.FRESHER,
    education: [{ degree: '', college: '', year: '', percentage: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    skills: [''],
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateStep = (currentStep: number) => {
    const newErrors: string[] = [];
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.push("Name is required");
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.push("Valid email is required");
      if (!formData.phone.trim()) newErrors.push("Phone number is required");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEdu = [...formData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setFormData(prev => ({ ...prev, education: newEdu }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExp = [...formData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addEducation = () => setFormData(prev => ({ ...prev, education: [...prev.education, { degree: '', college: '', year: '', percentage: '' }] }));
  const addExperience = () => setFormData(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }] }));
  const addSkill = () => setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));

  const removeEducation = (index: number) => setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  const removeSkill = (index: number) => setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));

  const handleClearData = () => {
    if (window.confirm("This will permanently delete your resume drafts and data from this browser. Proceed?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    // Clean data before submission
    const cleanData: UserData & { botCheck?: string } = {
      ...formData,
      botCheck: botCheck, // Include honeypot value
      education: formData.education.filter(e => e.degree.trim() || e.college.trim()),
      experience: formData.experience.filter(e => e.title.trim() || e.company.trim()),
      skills: formData.skills.filter(s => s.trim())
    };

    onSubmit(cleanData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Honeypot field - Hidden from users */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input 
          type="text" 
          name="botCheck" 
          value={botCheck} 
          onChange={(e) => setBotCheck(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off"
        />
      </div>

      {/* Privacy Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8 bg-green-50 py-3 px-6 rounded-2xl w-full border border-green-100">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-sm font-bold">🛡️ Privacy Shield Active:</span>
          <span className="text-green-800 text-xs font-medium">Your data stays in your browser.</span>
        </div>
        <button 
          onClick={handleClearData}
          className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline sm:ml-4"
        >
          Clear Data Now
        </button>
      </div>

      <div className="flex mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-2 rounded-full mx-1 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'} transition-colors duration-300`} />
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {errors.map((err, i) => <p key={i}>• {err}</p>)}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-bold">Personal Details</h2>
          <p className="text-gray-500 mb-6">Enter your contact information exactly as it should appear.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
              <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rahul Sharma" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="rahul@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 99999 88888" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location (City, State)</label>
              <input id="location" name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Indore, MP" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="jobRole" className="block text-sm font-medium mb-1">Target Job Role</label>
              <select id="jobRole" name="jobRole" value={formData.jobRole} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                {Object.values(JobRole).map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-bold">Education</h2>
          {formData.education.map((edu, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-3 relative group">
              {formData.education.length > 1 && (
                <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">✕</button>
              )}
              <input placeholder="Degree (e.g. B.Tech CS)" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} className="w-full border p-2 rounded" />
              <input placeholder="College/University" value={edu.college} onChange={e => handleEducationChange(idx, 'college', e.target.value)} className="w-full border p-2 rounded" />
              <div className="flex gap-2">
                <input placeholder="Year" value={edu.year} onChange={e => handleEducationChange(idx, 'year', e.target.value)} className="flex-1 border p-2 rounded" />
                <input placeholder="Percentage/CGPA" value={edu.percentage} onChange={e => handleEducationChange(idx, 'percentage', e.target.value)} className="flex-1 border p-2 rounded" />
              </div>
            </div>
          ))}
          <button onClick={addEducation} className="text-blue-600 font-medium hover:underline">+ Add More Education</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-bold">Experience / Internships</h2>
          <p className="text-gray-500">Freshers can add projects or internships.</p>
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-3 relative group">
               {formData.experience.length > 1 && (
                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">✕</button>
              )}
              <input placeholder="Job Title / Role" value={exp.title} onChange={e => handleExperienceChange(idx, 'title', e.target.value)} className="w-full border p-2 rounded" />
              <input placeholder="Company Name" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} className="w-full border p-2 rounded" />
              <input placeholder="Duration (e.g. June 2022 - Present)" value={exp.duration} onChange={e => handleExperienceChange(idx, 'duration', e.target.value)} className="w-full border p-2 rounded" />
              <textarea placeholder="Briefly describe what you did" value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} className="w-full border p-2 rounded h-20" />
            </div>
          ))}
          <button onClick={addExperience} className="text-blue-600 font-medium hover:underline">+ Add More Experience</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-bold">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2">
                <input placeholder="e.g. Communication" value={skill} onChange={e => handleSkillChange(idx, e.target.value)} className="flex-grow border p-2 rounded" />
                {formData.skills.length > 1 && (
                   <button onClick={() => removeSkill(idx)} className="text-gray-400 hover:text-red-500 transition-colors px-2">✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addSkill} className="text-blue-600 font-medium hover:underline">+ Add More Skills</button>
        </div>
      )}

      <div className="mt-10 flex justify-between">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition shadow-sm">
            Back
          </button>
        ) : <div />}
        
        {step < 4 ? (
          <button onClick={handleNext} className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold">
            Next
          </button>
        ) : (
          <button 
            disabled={isLoading}
            onClick={handleSubmit} 
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition shadow-md font-bold"
          >
            {isLoading ? 'Generating Documents...' : 'Generate Documents'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;

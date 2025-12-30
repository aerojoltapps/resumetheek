import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageType } from '../types';

const SAMPLES = [
  {
    role: "Software Engineer",
    enumValue: "IT / Software Engineer",
    desc: "Modern layout for tech roles, focusing on projects and tech stack.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    tag: "Recruiter's Choice"
  },
  {
    role: "Sales Executive",
    enumValue: "Sales & Marketing",
    desc: "High-impact layout emphasizing targets achieved and CRM skills.",
    img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800",
    tag: "Best for Growth"
  },
  {
    role: "Fresher Graduate",
    enumValue: "Fresher (Any Graduate)",
    desc: "Clear structure focusing on education, internships, and potential.",
    img: "https://images.unsplash.com/photo-1626197031507-c1709955b042?auto=format&fit=crop&q=80&w=800",
    tag: "Top Rated"
  },
  {
    role: "HR & Recruitment",
    enumValue: "HR & Recruitment",
    desc: "Elegant professional layout for people-focused roles.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    tag: "Corporate Ready"
  },
  {
    role: "Digital Marketer",
    enumValue: "Digital Marketing & SEO",
    desc: "Modern design highlighting performance metrics and social tools.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tag: "Modern & Creative"
  },
  {
    role: "Data Analyst",
    enumValue: "Data Analyst / Scientist",
    desc: "Minimalist structure focusing on technical tools and insights.",
    img: "https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=800",
    tag: "Highly Analytical"
  },
  {
    role: "Teacher / Educator",
    enumValue: "Teaching & Education",
    desc: "Structured layout for academic achievements and certifications.",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    tag: "Academic Excellence"
  },
  {
    role: "Staff Nurse",
    enumValue: "Healthcare / Nursing",
    desc: "Clean layout prioritizing certifications and clinical experience.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    tag: "Healthcare Standard"
  }
];

const Gallery: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<typeof SAMPLES[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Recruiter-Approved Samples</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore how our professional resume service in India helps freshers and pros get hired.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SAMPLES.map((sample, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedSample(sample)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={sample.img} alt={sample.role} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  {sample.tag}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white/90 text-blue-600 px-4 py-2 rounded-lg font-bold shadow-xl">View Details</span>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{sample.role}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sample.desc}</p>
              <div className="mt-auto">
                <span className="text-blue-600 font-bold text-sm">Preview Layout →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Preview Modal */}
      {selectedSample && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fadeIn" onClick={() => setSelectedSample(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedSample(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-1/2 overflow-y-auto bg-gray-100">
                <img src={selectedSample.img} className="w-full h-auto" alt="Full Preview" />
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">{selectedSample.tag}</span>
                <h2 className="text-3xl font-black mb-4 tracking-tight">{selectedSample.role}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                  This ATS friendly resume template is optimized for Indian recruiters. It features high readability, professional typography, and meets the standards of a premium resume writing service in India. 
                  Candidates using this format see significantly higher response rates.
                </p>
                <Link 
                  to={`/builder?package=${PackageType.JOB_READY_PACK}&role=${encodeURIComponent(selectedSample.enumValue)}`} 
                  className="bg-blue-600 text-white text-center py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl transform active:scale-95"
                >
                  Create My Resume
                </Link>
                <p className="mt-4 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">Build yours in 15 mins</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-24 bg-blue-600 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-6 tracking-tight">Need Fresher Resume Help?</h2>
          <p className="mb-10 text-blue-100 max-w-2xl mx-auto text-lg font-medium">Join 1000+ Indians who used JobDocPro to land interviews at top companies. Our ATS friendly resume writing service India is here to help you grow.</p>
          <Link to="/builder" className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition shadow-2xl inline-block transform hover:scale-105 active:scale-95">
            Start Building Now
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Gallery;
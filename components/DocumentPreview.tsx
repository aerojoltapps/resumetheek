import React, { useEffect, useState } from 'react';
import { UserData, DocumentResult, PackageType } from '../types';

interface Props {
  user: UserData;
  result: DocumentResult;
  packageType: PackageType;
  isPreview?: boolean;
  onUnlock?: () => void;
  onRefine?: (feedback: string) => void;
  isRefining?: boolean;
  remainingCredits: number;
}

const DocumentPreview: React.FC<Props> = ({ 
  user, 
  result, 
  packageType, 
  isPreview = false, 
  onUnlock, 
  onRefine, 
  isRefining = false,
  remainingCredits
}) => {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${user.fullName}_Resume`;
    return () => {
      document.title = originalTitle;
    };
  }, [user.fullName]);

  const hasCoverLetter = packageType === PackageType.RESUME_COVER || packageType === PackageType.JOB_READY_PACK;
  const hasLinkedIn = packageType === PackageType.JOB_READY_PACK;

  const handleRefineSubmit = () => {
    if (!feedback.trim()) return;
    if (remainingCredits <= 0) {
      alert("No credits remaining for AI refinement.");
      return;
    }
    onRefine?.(feedback);
    setFeedback('');
  };

  return (
    <div className="space-y-12 pb-24 print-container relative animate-fadeIn">
      {/* Visual Instruction */}
      {!isPreview && (
        <div className="max-w-[210mm] mx-auto bg-blue-50 border border-blue-100 p-5 rounded-2xl no-print flex flex-col md:flex-row items-center gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-black text-blue-900 text-sm">Download Pro Tip:</h4>
              <p className="text-blue-700 text-xs mt-1 leading-relaxed font-medium">
                When printing to PDF, ensure <strong>"Headers & Footers"</strong> are <u>Unchecked</u> in "More Settings" for the cleanest professional look.
              </p>
            </div>
          </div>
          <div className="md:ml-auto no-print">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
              <span className="text-[10px] font-black uppercase text-gray-400">Credits:</span>
              <span className={`text-sm font-black ${remainingCredits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {remainingCredits} / 3
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ask AI Refinement Section - Only for paid users */}
      {!isPreview && onRefine && (
        <div className="max-w-[210mm] mx-auto bg-white border border-gray-100 p-6 rounded-[2rem] no-print shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">AI</div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Modify Content (Ask AI)</h4>
          </div>
          <div className="flex gap-3">
            <input 
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isRefining || remainingCredits <= 0}
              placeholder={remainingCredits > 0 ? "e.g., 'Make the summary more senior' or 'Highlight my project management skills'" : "No credits left to edit"}
              className="flex-grow border border-gray-200 p-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleRefineSubmit}
              disabled={isRefining || !feedback.trim() || remainingCredits <= 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isRefining ? 'Refining...' : 'Update'}
            </button>
          </div>
          <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Updating will consume 1 credit.</p>
        </div>
      )}

      {/* Resume Section */}
      <section className={`bg-white p-12 shadow-2xl border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 relative print:shadow-none print:border-none print:p-0 ${isPreview ? 'overflow-hidden max-h-[800px]' : ''}`}>
        
        {/* Professional Header */}
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{user.fullName}</h1>
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
            <span>{user.email}</span>
            <span>•</span>
            <span>{user.phone}</span>
            <span>•</span>
            <span>{user.location}</span>
          </div>
        </div>

        {/* Content with Blur Logic */}
        <div className={`space-y-8 ${isPreview ? 'blur-[10px] select-none pointer-events-none' : ''}`}>
          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-4 uppercase tracking-[3px] text-blue-900">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-[15px] font-medium">{result.resumeSummary}</p>
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-6 uppercase tracking-[3px] text-blue-900">Career History</h2>
            {user.experience.map((exp, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-black text-[16px] text-gray-900">{exp.title}</span>
                  <span className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">{exp.duration}</span>
                </div>
                <div className="text-blue-700 font-black text-[13px] uppercase mb-3">{exp.company}</div>
                <ul className="list-disc ml-5 text-[14px] text-gray-700 space-y-2 font-medium">
                  {(result.experienceBullets[idx] || []).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-4 uppercase tracking-[3px] text-blue-900">Academic Background</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.education.map((edu, idx) => (
                <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="font-black text-[14px] text-gray-900">{edu.degree}</p>
                  <p className="text-[12px] text-gray-500 font-bold uppercase tracking-tighter mt-1">
                    {edu.college} • Class of {edu.year} 
                    {edu.percentage ? ` • ${edu.percentage.includes('%') ? edu.percentage : `${edu.percentage}%`}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-4 uppercase tracking-[3px] text-blue-900">Key Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {result.keywordMapping?.map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Overlay */}
        {isPreview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[2px] p-12 text-center no-print">
            <div className="bg-white/95 border border-blue-50 p-12 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] max-w-sm animate-scaleIn">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-3xl font-black mb-3 text-gray-900 tracking-tight">Your Resume is Ready!</h3>
              <p className="text-gray-500 text-sm mb-10 font-medium leading-relaxed">We've generated an ATS-optimized resume for <strong>{user.jobRole}</strong>. Unlock the full document to download your PDF.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={onUnlock}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
                >
                  Unlock Documents
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                   <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                   Includes 3 Generations
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Secondary Documents (Hidden in Preview) */}
      {!isPreview && (
        <>
          {hasCoverLetter && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-10 no-print flex items-center gap-3">
                 <span className="text-blue-600">✉️</span> Cover Letter
              </h2>
              <div className="text-[15px] leading-relaxed space-y-8 font-medium text-gray-800 max-w-2xl">
                <div className="mb-10">
                  <p className="font-black text-gray-900">{user.fullName}</p>
                  <p className="text-gray-500">{user.location} | {user.email}</p>
                </div>
                <p>Dear Hiring Manager,</p>
                <div className="whitespace-pre-wrap">{result.coverLetter}</div>
                <div className="pt-10">
                  <p>Sincerely,</p>
                  <p className="font-black mt-2 text-lg text-gray-900">{user.fullName}</p>
                </div>
              </div>
            </section>
          )}

          {hasLinkedIn && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-10 no-print flex items-center gap-3">
                 <span className="text-blue-600 font-bold tracking-tighter">in</span> LinkedIn Optimization
              </h2>
              <div className="space-y-12">
                <div className="group">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[2px]">Optimized Headline</p>
                  <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl font-black text-blue-900 text-xl leading-tight transition-transform hover:scale-[1.01]">{result.linkedinHeadline}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[2px]">About Section (Summary)</p>
                  <div className="p-10 bg-gray-50 border border-gray-200 rounded-3xl text-[15px] whitespace-pre-wrap leading-relaxed font-medium text-gray-700">
                    {result.linkedinSummary}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Floating Download Button */}
      {!isPreview && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 no-print">
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center gap-4">
            <span className="bg-white/20 p-2 rounded-full leading-none">PDF</span>
            <span>Download All Documents</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
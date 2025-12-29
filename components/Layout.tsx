import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isOnBuilder = location.pathname === '/builder';

  const clearAllUserData = () => {
    if (window.confirm("CRITICAL: This will permanently delete your resume drafts, payment history, and credits from this browser. This action cannot be undone. Proceed?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                Resume<span className="text-gray-900">Theek</span>
              </Link>
            </div>
            <div className="hidden lg:flex space-x-8 text-sm font-bold items-center">
              <Link to="/" className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Home</Link>
              <Link to="/samples" className={`${isActive('/samples') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Resume Samples</Link>
              <Link to="/pricing" className={`${isActive('/pricing') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Pricing</Link>
              <Link to="/faq" className={`${isActive('/faq') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>FAQ</Link>
              <button 
                onClick={clearAllUserData}
                className="text-gray-400 hover:text-red-500 transition text-xs border-l border-gray-200 pl-8 ml-2 font-black uppercase tracking-widest"
              >
                Clear My Data
              </button>
            </div>
            <div className="flex items-center gap-4">
              {!isOnBuilder && (
                <Link 
                  to="/builder"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                >
                  Create Resume
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black mb-6 tracking-tighter">ResumeTheek</h3>
              <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                Helping Indian job seekers land their dream roles with recruiter-ready documents. 
                Focus on Tier 2/3 cities and freshers. No AI skills required.
              </p>
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800">
                <h4 className="text-xs font-black uppercase tracking-[2px] text-blue-400 mb-3">Privacy & Security</h4>
                <p className="text-[11px] text-gray-500 font-medium mb-4">
                  We value your privacy. Your career data and personal details are stored <strong>only in your browser</strong> and never on our servers.
                </p>
                <button 
                  onClick={clearAllUserData}
                  className="text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Clear All My Data
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-gray-400 text-sm font-medium">
                <li><Link to="/samples" className="hover:text-white transition">Sample Resumes</Link></li>
                <li><Link to="/builder" className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Support</h4>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="text-blue-400 font-bold">Email:</span> aerojoltapps@gmail.com
                </p>
                <div className="pt-4 flex gap-4 opacity-50">
                  <span className="text-xs font-bold border border-gray-700 px-2 py-1 rounded">SSL SECURED</span>
                  <span className="text-xs font-bold border border-gray-700 px-2 py-1 rounded">CLIENT-ONLY STORAGE</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-xs font-medium uppercase tracking-[2px]">
            © 2024 ResumeTheek. Crafted with passion for India.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
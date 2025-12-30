
import { UserData, DocumentResult, PackageType, JobRole } from './types';
import { generateJobDocuments } from './services/geminiService';
import { PRICING, RAZORPAY_KEY_ID } from './constants';
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';

const PackageCard = ({ 
  pkgKey, 
  data, 
  onSelect, 
  isSelected = false 
}: { 
  pkgKey: string, 
  data: any, 
  onSelect?: (key: PackageType) => void,
  isSelected?: boolean 
}) => {
  const isFeatured = pkgKey === PackageType.JOB_READY_PACK;
  
  return (
    <div className={`bg-white p-10 rounded-[2.5rem] shadow-sm border flex flex-col hover:shadow-xl transition-all duration-300 ${isFeatured ? 'ring-4 ring-blue-600 relative border-transparent' : 'border-gray-100'} ${isSelected ? 'border-blue-600 ring-2' : ''}`}>
      {isFeatured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Best Value</span>
      )}
      <h3 className="text-xl font-bold mb-4">{data.label}</h3>
      <div className="text-5xl font-black mb-8">₹{data.price}</div>
      <ul className="text-left space-y-4 mb-10 flex-grow text-sm text-gray-600 font-medium">
        {data.features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
      {onSelect ? (
        <button 
          onClick={() => onSelect(pkgKey as PackageType)} 
          className={`w-full py-4 rounded-xl font-bold text-center transition shadow-md active:scale-95 ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      ) : (
        <Link 
          to={`/builder?package=${pkgKey}`} 
          className={`w-full py-4 rounded-xl font-bold text-center transition shadow-md active:scale-95 ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          Get Started
        </Link>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <Layout>
      <div className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative bg-white pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[2px] mb-6 animate-fadeIn">
              Best Professional Resume Service in India
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              Get a job-ready resume <br className="hidden md:block" /> 
              <span className="text-blue-600">in 15 minutes.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-semibold leading-relaxed">
              We provide ATS-friendly resume writing services in India for freshers and experienced professionals. 
              <strong> No AI skills needed. No complex prompts. Just professional documents ready to submit to Indian recruiters.</strong>
            </p>
            <p className="text-md text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of job seekers using our <strong>Resume writing service India</strong> to build an <strong>ATS friendly resume</strong>. Get expert <strong>fresher resume help</strong> with our <strong>professional resume service</strong> today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link 
                to="/builder"
                className="px-12 py-6 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl shadow-blue-200"
              >
                🟢 Build My Resume Now
              </Link>
              <div className="flex flex-col items-center sm:items-start justify-center text-sm font-bold text-gray-400 gap-1 uppercase tracking-widest">
                <span className="flex items-center gap-2 text-gray-900">✔ Indian recruiter approved</span>
                <span className="flex items-center gap-2 text-gray-900">✔ 100% ATS Friendly</span>
                <span className="flex items-center gap-2 text-gray-900">✔ Clean professional formats</span>
              </div>
            </div>
            <div className="relative max-w-5xl mx-auto group">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl group-hover:bg-blue-600/10 transition"></div>
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200" className="relative rounded-3xl shadow-2xl border-4 border-white" alt="Resume Preview" />
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">ResumeTheek vs. Free AI Tools</h2>
              <p className="text-gray-500 font-medium">Why we are the preferred resume writing service in India.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-gray-400">Generic AI (ChatGPT)</h3>
                  <ul className="space-y-4 text-sm text-gray-400">
                    <li>❌ Formatting breaks in ATS</li>
                    <li>❌ Generic, non-Indian language</li>
                    <li>❌ Hard to get the right keywords</li>
                    <li>❌ Requires complex prompting</li>
                  </ul>
               </div>
               <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-6">ResumeTheek</h3>
                  <ul className="space-y-4 text-sm font-bold">
                    <li>✅ Recruiter-Approved Layouts</li>
                    <li>✅ Indian Job Market Keywords</li>
                    <li>✅ Instant Clean PDF/Word Export</li>
                    <li>✅ 15-Min Simple Form Flow</li>
                  </ul>
               </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const Builder = () => {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(searchParams.get('package') as PackageType | null);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('rt_draft');
    const initialRole = searchParams.get('role');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      if (initialRole) parsed.jobRole = initialRole as JobRole;
      return parsed;
    }
    return null;
  });

  const [result, setResult] = useState<DocumentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  // Storage Keys
  const ID_KEY = btoa('rt_v1_paid_ids');
  const CREDITS_KEY = btoa('rt_v1_credits_log');

  const getIdentifier = (email: string, phone: string) => `${email.toLowerCase().trim()}_${phone.trim()}`;
  
  const [paidIdentifiers, setPaidIdentifiers] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem(ID_KEY) || '[]')
  );
  const [creditsMap, setCreditsMap] = useState<Record<string, number>>(() => 
    JSON.parse(localStorage.getItem(CREDITS_KEY) || '{}')
  );

  const currentId = userData ? getIdentifier(userData.email, userData.phone) : '';
  const isPaid = paidIdentifiers.includes(currentId);
  const remainingCredits = creditsMap[currentId] !== undefined ? creditsMap[currentId] : 0;

  useEffect(() => {
    if (userData) localStorage.setItem('rt_draft', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem(ID_KEY, JSON.stringify(paidIdentifiers));
  }, [paidIdentifiers]);

  useEffect(() => {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(creditsMap));
  }, [creditsMap]);

  const onFormSubmit = async (data: UserData) => {
    const id = getIdentifier(data.email, data.phone);
    setUserData(data);
    setIsGenerating(true);
    setResult(null);

    try {
      const generated = await generateJobDocuments(data, id);
      setResult(generated);
      
      setPaidIdentifiers(prev => prev.includes(id) ? prev : [...prev, id]);
      if (generated.remainingCredits !== undefined) {
        setCreditsMap(prev => ({
          ...prev,
          [id]: generated.remainingCredits!
        }));
      }
      
      window.scrollTo(0, 0);
    } catch (e: any) {
      const errorMsg = typeof e === 'string' ? e : (e.message || JSON.stringify(e));
      const lowerError = errorMsg.toLowerCase();
      
      if (lowerError.includes('payment required') || 
          lowerError.includes('complete your purchase') || 
          lowerError.includes('verification failed') ||
          lowerError.includes('"payment required"') ||
          lowerError.includes('purchase required')) {
        setIsCheckout(true);
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRazorpayCheckout = () => {
    if (!userData || !selectedPackage) return;
    
    const rzp = (window as any).Razorpay;
    if (!rzp) {
      alert("Payment gateway is taking longer than expected to load. Please refresh.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: PRICING[selectedPackage].price * 100,
      currency: "INR",
      name: "ResumeTheek",
      description: `Unlock Full Documents - ${PRICING[selectedPackage].label}`,
      handler: async function(response: any) {
        if (response.razorpay_payment_id) {
          const sync = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify({
              identifier: currentId,
              paymentId: response.razorpay_payment_id,
              packageType: selectedPackage
            })
          });
          
          if (sync.ok) {
            handlePaymentSuccess();
          }
        }
      },
      prefill: {
        name: userData.fullName,
        email: userData.email,
        contact: userData.phone
      },
      theme: { color: "#2563eb" }
    };

    const instance = new rzp(options);
    instance.open();
  };

  const handlePaymentSuccess = () => {
    if (userData) {
      const id = getIdentifier(userData.email, userData.phone);
      setPaidIdentifiers(prev => prev.includes(id) ? prev : [...prev, id]);
      setCreditsMap(prev => ({ ...prev, [id]: 3 }));
      setIsCheckout(false);
      onFormSubmit(userData);
      window.scrollTo(0, 0);
    }
  };

  const handleRefine = async (feedback: string) => {
    if (!userData || remainingCredits <= 0) return;
    setIsGenerating(true);
    try {
      const refined = await generateJobDocuments(userData, currentId, feedback);
      setResult(refined);
      
      if (refined.remainingCredits !== undefined) {
        setCreditsMap(prev => ({
          ...prev,
          [currentId]: refined.remainingCredits!
        }));
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGlobalClear = () => {
    if (window.confirm("CRITICAL: This will permanently delete your resume drafts, payment history, and credits from this browser. This action cannot be undone. Proceed?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Select Your Plan</h1>
          <p className="text-gray-500 mb-12 font-medium italic">All plans include 3 full generations to get your details perfect.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PRICING).map(([key, val]) => (
              <PackageCard key={key} pkgKey={key} data={val} onSelect={setSelectedPackage} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isGenerating) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-32 text-center">
           <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
           <h2 className="text-3xl font-black mb-4 tracking-tight">Securing Documents...</h2>
           <p className="text-gray-500 font-medium italic">Calling server-side AI. Your details remain private.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        {result && userData ? (
          <>
            <div className="flex justify-between items-center mb-10 no-print">
              <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline">← Edit Details</button>
              <div className="flex flex-col items-end">
                {isPaid ? (
                   <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                      Pro Access Active
                   </div>
                ) : (
                  <button onClick={() => setIsCheckout(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black hover:bg-blue-700">🚀 Unlock Now</button>
                )}
              </div>
            </div>
            <DocumentPreview 
              user={userData} 
              result={result} 
              packageType={selectedPackage} 
              isPreview={!isPaid}
              onUnlock={() => setIsCheckout(true)}
              onRefine={isPaid ? handleRefine : undefined}
              remainingCredits={remainingCredits}
            />
          </>
        ) : (
          <div className="max-w-4xl mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold hover:underline">← Change Package</button>
              <button 
                onClick={handleGlobalClear} 
                className="text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
              >
                Clear All My Data
              </button>
            </div>
            <div className="text-center mb-16">
              <h1 className="text-4xl font-black tracking-tight">Career Details</h1>
              <p className="text-gray-500 mt-2 font-medium">Your data is processed on our secure Vercel server.</p>
            </div>
            <ResumeForm onSubmit={onFormSubmit} isLoading={isGenerating} initialData={userData} />
          </div>
        )}
      </div>

      {isCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-blue-100 max-w-xl w-full text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to Apply?</h2>
            <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
               <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
               <div className="mt-2 text-sm text-blue-100 font-bold uppercase tracking-widest opacity-80">One-Time Payment</div>
            </div>
            <button onClick={handleRazorpayCheckout} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform hover:scale-105">Unlock Instantly</button>
            <button onClick={() => setIsCheckout(false)} className="mt-4 block w-full text-gray-400 font-bold text-xs uppercase">Maybe Later</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, One-Time Pricing</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(PRICING).map(([key, val]) => (
          <PackageCard key={key} pkgKey={key} data={val} />
        ))}
      </div>
    </div>
  </Layout>
);

const FAQ = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-5xl font-black text-center mb-16">Common Questions</h1>
      <div className="space-y-6">
        {[
          { q: "Is this ATS friendly?", a: "Yes. Our formats are specifically designed for the software used by Indian firms like TCS, Infosys, and startups." },
          { q: "Is my data secure?", a: "We use server-side AI processing via Vercel. Your API keys are never exposed and your data is processed privately." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-black mb-2">{item.q}</h3>
            <p className="text-gray-600 font-medium">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

const TermsAndConditions = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4 prose prose-blue">
      <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>
      <div className="space-y-6 text-gray-700 font-medium">
        <p>Welcome to ResumeTheek. By using our service, you agree to the following terms:</p>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Service Description</h2>
          <p>ResumeTheek provides an AI-assisted resume and job document generation service. The results are based on the data provided by the user.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. User Responsibility</h2>
          <p>Users are responsible for the accuracy of the information provided. While our AI aims for high quality, users should review and verify all generated content before use in professional applications.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Payments</h2>
          <p>Payments are processed securely via Razorpay. Access to premium features is granted upon successful payment confirmation.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Data Storage</h2>
          <p>We prioritize privacy. Draft data is stored locally in your browser. Verification records are stored securely in our cloud database for quota management.</p>
        </section>
      </div>
    </div>
  </Layout>
);

const RefundPolicy = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-4xl font-black mb-8 text-center">Cancellations and Refunds</h1>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <p className="text-gray-700 font-medium text-lg leading-relaxed">
          At ResumeTheek, we strive for perfection. Due to the digital nature of our service (instant AI generation), we typically follow a <strong>no cancellation and no refund policy</strong> once a payment is made and processing has begun.
        </p>
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
          <h3 className="font-black text-blue-900 mb-2">Not satisfied with the result?</h3>
          <p className="text-blue-700 font-medium">
            If you are genuinely unhappy with the documents generated, please reach out to us. We handle exceptional cases on a one-to-one basis.
          </p>
        </div>
        <p className="text-gray-600 font-medium">
          For any concerns or feedback, please email us at: <br />
          <a href="mailto:aerojoltapps@gmail.com" className="text-blue-600 font-black underline">aerojoltapps@gmail.com</a>
        </p>
        <p className="text-sm text-gray-400">Please include your registered email and phone number in your request.</p>
      </div>
    </div>
  </Layout>
);

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/samples" element={<Gallery />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/refunds" element={<RefundPolicy />} />
    </Routes>
  </Router>
);

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react'; // UNCOMMENT FOR PRODUCTION
import emailjs from '@emailjs/browser'; // UNCOMMENT FOR PRODUCTION
import { Instagram, Menu, X, ArrowRight, CheckCircle, ChevronDown, Globe, Shield, Zap, Lock, UploadCloud, Send, Play, FileText, Trash2 } from 'lucide-react';

/* --- CONFIGURATION --- */
// Generated Random Credentials
const CASTING_ID = "LUX-9B4K";
const CASTING_PIN = "837192";
const CLOUDINARY_CLOUD_NAME = "dobrbqjwm";
const CLOUDINARY_PRESET = "luxieria_uploads";

// --- CASTING PORTAL (Private - Multi File Batch) ---
const CastingPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputId, setInputId] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputId.toUpperCase() === CASTING_ID && inputPin === CASTING_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Casting ID or PIN');
    }
  };

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      alert("Upload widget not loaded. Refresh page.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_PRESET,
        sources: ['local', 'camera'], 
        maxFiles: 100,
        clientAllowedFormats: ['image', 'video'], 
        styles: {
          palette: {
            window: "#ffffff",
            sourceBg: "#f4f4f5",
            windowBorder: "#000000",
            tabIcon: "#000000",
            inactiveTabIcon: "#555555",
            menuIcons: "#000000",
            link: "#000000",
            action: "#000000",
            inProgress: "#000000",
            complete: "#000000",
            error: "#cc0000",
            textDark: "#000000",
            textLight: "#ffffff"
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setUploadedFiles(prev => [...prev, result.info]);
          setSubmissionStatus('uploading'); 
        }
      }
    );
    widget.open();
  };

  const handleFinalSubmit = () => {
    setSubmissionStatus('sending');
    
    
    const fileListString = uploadedFiles.map(f => `${f.original_filename}: ${f.secure_url}`).join('\n\n');
    
    emailjs.send('service_c7gu1qs', 'template_03aeqt5', {
      casting_id: CASTING_ID,
      file_list: fileListString, // Uses {{file_list}} in template
    }, 'RlOcxI1To8sBKyXlJ')
    .then(() => setSubmissionStatus('complete'))
    .catch((err) => {
       console.error(err);
       setSubmissionStatus('uploading');
       alert("Error sending notification.");
    });
    

    
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center mb-10">
            <div className="border-2 border-black p-3 mb-4">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Restricted Access</h2>
            <div className="h-1 w-12 bg-black mt-4"></div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest">Casting ID</label>
              <input 
                type="text" 
                value={inputId} 
                onChange={(e) => setInputId(e.target.value.toUpperCase())} 
                className="w-full border-2 border-black p-4 text-center font-bold placeholder-gray-300 focus:outline-none focus:bg-zinc-50 uppercase tracking-widest text-lg" 
                placeholder="LUX-XXXX" 
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest">Secure PIN</label>
              <input 
                type="password" 
                value={inputPin} 
                onChange={(e) => setInputPin(e.target.value)} 
                className="w-full border-2 border-black p-4 text-center font-bold placeholder-gray-300 focus:outline-none focus:bg-zinc-50 text-lg tracking-widest" 
                placeholder="••••••" 
                autoComplete="new-password"
              />
            </div>
            {error && (<div className="bg-red-50 border border-red-200 p-3 text-center"><p className="text-red-600 text-xs font-bold uppercase">{error}</p></div>)}
            <button className="w-full bg-black text-white h-16 uppercase tracking-[0.2em] font-black hover:bg-zinc-800 transition-all flex items-center justify-center group">
              Access Portal <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
            <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">← Return to Main Site</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <header className="border-b-2 border-black bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-black tracking-tighter text-xl">SECURE UPLOAD</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest border border-black px-3 py-1">
            ID: {CASTING_ID}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 md:py-20">
        {submissionStatus === 'complete' ? (
          <div className="bg-zinc-50 border-2 border-black p-12 text-center">
            <div className="w-20 h-20 bg-black text-white mx-auto flex items-center justify-center mb-8">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Upload Complete</h2>
            <p className="text-gray-600 font-medium mb-8 max-w-md mx-auto">
              Your digital assets have been successfully encrypted and transferred to our casting server.
            </p>
            <button onClick={() => { setUploadedFiles([]); setSubmissionStatus('idle'); }} className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
              Submit Additional Files
            </button>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.85]">Digital<br/>Submission</h1>
              <p className="text-gray-600 font-medium max-w-lg border-l-4 border-black pl-6 py-2">Please upload high-resolution digitals and video introductions.</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-8 border-2 border-black">
                <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Manifest</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{uploadedFiles.length} Items</span>
                </div>
                <div className="divide-y-2 divide-black bg-white max-h-64 overflow-y-auto">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-bold truncate">{f.original_filename}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2 py-1">Ready</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6">
              <button onClick={openUploadWidget} className="group relative h-40 border-2 border-dashed border-black hover:bg-zinc-50 transition-all flex flex-col items-center justify-center overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-black uppercase tracking-widest">Select Files to Upload</span>
                  <span className="text-[10px] uppercase text-gray-500 mt-2">Images / Video • Max 50MB</span>
                </div>
              </button>
              
              {uploadedFiles.length > 0 && (
                <button onClick={handleFinalSubmit} disabled={submissionStatus === 'sending'} className="w-full bg-black text-white h-20 uppercase tracking-[0.2em] font-black text-sm hover:bg-zinc-900 transition-all flex items-center justify-between px-8 group disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="flex flex-col items-start">
                    <span>{submissionStatus === 'sending' ? 'Encrypting...' : 'Finalize Submission'}</span>
                    <span className="text-[10px] text-zinc-400 font-normal normal-case mt-1">Send to Casting Director</span>
                  </span>
                  <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <div className="mt-auto border-t border-gray-200 py-6 text-center">
        <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Log Out / Return Home</a>
      </div>
    </div>
  );
};

// --- MAIN SITE COMPONENTS ---

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => (
  <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
    <div className="max-w-[1800px] mx-auto px-6 h-20 flex justify-between items-center">
      <a href="#" className="text-2xl font-black tracking-tighter">LUXIERIA<span className="text-zinc-400">.</span></a>
      <div className="hidden md:flex gap-8 items-center">
        <a href="#agency" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Agency</a>
        <a href="#talent" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Board</a>
        <a href="#apply" className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800">Apply</a>
      </div>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden"><Menu /></button>
    </div>
    {mobileMenuOpen && (
      <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 p-6 flex flex-col gap-4 md:hidden">
        <a href="#agency" className="text-lg font-bold uppercase" onClick={() => setMobileMenuOpen(false)}>Agency</a>
        <a href="#talent" className="text-lg font-bold uppercase" onClick={() => setMobileMenuOpen(false)}>Talent Board</a>
        <a href="#apply" className="text-lg font-bold uppercase text-red-600" onClick={() => setMobileMenuOpen(false)}>Apply Now</a>
      </div>
    )}
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen pt-20 flex flex-col justify-between">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white z-10"></div>
      <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90" alt="Editorial" />
    </div>
    <div className="relative z-20 px-6 max-w-[1800px] mx-auto w-full pt-20 md:pt-32">
      <div className="max-w-4xl">
        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6 bg-black text-white inline-block px-2 py-1">Now Scouting 2026</p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8">THE NEW<br/>FACE OF<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-500">REALITY.</span></h1>
        <p className="text-sm md:text-base font-medium max-w-lg leading-relaxed text-gray-900 bg-white/80 p-4 backdrop-blur-sm">Luxieria is a premier management agency bridging the gap between high-fashion editorial and major reality television formats.</p>
      </div>
    </div>
    <div className="relative z-20 bg-black text-white overflow-hidden py-4 border-y border-zinc-800">
      <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
        {[1,2,3,4,5].map(i => (
          <React.Fragment key={i}>
            <span className="text-xs font-bold uppercase tracking-widest">White Fox Boutique</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Oh Polly</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Jacquemus</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Frankies Bikinis</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Blackbough Swim</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Kulani Kinis</span><span className="text-zinc-600 text-[10px]">●</span>
            <span className="text-xs font-bold uppercase tracking-widest">Triangl</span><span className="text-zinc-600 text-[10px]">●</span>



          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

const AgencyMetrics = () => (
  <section id="agency" className="py-20 border-b border-gray-100">
    <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-4"><Globe className="w-8 h-8 text-black" /><h3 className="text-xl font-bold uppercase tracking-tight">Global Placement</h3><p className="text-sm text-gray-500 leading-relaxed">Our talent is cast globally, from the villas of Mallorca to the runways of Miami Swim Week. We handle visa logistics and travel management.</p></div>
      <div className="space-y-4"><Shield className="w-8 h-8 text-black" /><h3 className="text-xl font-bold uppercase tracking-tight">Career Protection</h3><p className="text-sm text-gray-500 leading-relaxed">We are not just a booking platform. We manage contracts, negotiate rates, and ensure safety standards on every set and production.</p></div>
      <div className="space-y-4"><Zap className="w-8 h-8 text-black" /><h3 className="text-xl font-bold uppercase tracking-tight">Digital Development</h3><p className="text-sm text-gray-500 leading-relaxed">Transitioning from model to influencer. Our digital team builds your personal brand to ensure longevity beyond the show.</p></div>
    </div>
  </section>
);

const TalentBoard = () => {
  const models = [
    { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop", name: "ELENA", height: "5'10\"", cast: "Vogue Italia • Editorial" },
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop", name: "SIENNA", height: "5'9\"", cast: "Miami Swim Week • Oh Polly" },
    { src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2070&auto=format&fit=crop", name: "EMMA", height: "5'11\"", cast: "Jacquemus • Summer 2025" },
    { src: "https://images.unsplash.com/photo-1616002411355-49593fd89721?q=80&w=1964&auto=format&fit=crop", name: "JASMINE", height: "5'8\"", cast: "Revolve • Global Campaign" }
  ];
  return (
    <section id="talent" className="border-b border-black bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-black">
          <div className="lg:col-span-8 p-12 md:p-24 border-b lg:border-b-0 lg:border-r border-black">
            <span className="block text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Selected Faces</span>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">Main<br/>Board</h2>
          </div>
          <div className="lg:col-span-4 p-12 flex flex-col justify-end items-start bg-zinc-50">
            <p className="font-serif text-2xl leading-tight mb-8">"Luxieria represents the new standard of beauty—effortless, diverse, and unapologetically bold."</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {models.map((model, i) => (
            <div key={i} className="group relative border-r border-b border-black border-collapse last:border-r-0 lg:last:border-r-0">
              <div className="aspect-[3/4] overflow-hidden relative border-b border-black">
                <img src={model.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={model.name} />
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">{model.cast}</div>
              </div>
              <div className="p-6 bg-white group-hover:bg-zinc-50 transition-colors">
                <div className="flex justify-between items-center"><h3 className="text-xl font-black tracking-tighter uppercase">{model.name}</h3><span className="text-xs font-bold text-gray-400">{model.height}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Application = () => {
  const [state, setState] = useState('idle');
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setState('submitting');
    

    emailjs.sendForm('service_c7gu1qs', 'template_xk0m9ad', form.current, 'RlOcxI1To8sBKyXlJ')
      .then(() => setState('success'))
      .catch((error) => {
          console.error(error.text);
          alert("There was an error submitting your application.");
          setState('idle');
      });
    
    

  };

  if (state === 'success') {
    return (
      <section className="py-24 bg-black text-white text-center px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black tracking-tighter mb-4">APPLICATION RECEIVED</h2>
          <p className="text-gray-400 mb-8">Our casting directors review submissions every Tuesday and Thursday. If you fit a current brief, we will contact you via email.</p>
          <button onClick={() => setState('idle')} className="text-xs font-bold uppercase border-b border-white pb-1">Submit Another</button>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="bg-zinc-100 p-12 lg:p-24 flex flex-col justify-center">
        <span className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Be Discovered</span>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">JOIN THE<br/>AGENCY.</h2>
        <p className="text-gray-600 font-medium max-w-md mb-12 leading-relaxed">We are currently accepting applications for the 2026 roster. We are looking for unique faces for Commercial, Swim, and Reality TV. No prior experience required.</p>
        <div className="flex gap-4 items-center text-sm font-bold"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>Status: SCOUTING OPEN</div>
      </div>
      <div className="bg-white p-12 lg:p-24 border-l border-gray-100 flex flex-col justify-center">
        <form ref={form} onSubmit={handleSubmit} className="space-y-8 max-w-md w-full mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">First Name</label>
              <input required name="user_name" type="text" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Name</label>
              <input required type="text" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
            <input required name="user_email" type="email" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instagram</label>
              <input required name="instagram_handle" type="text" placeholder="@" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">TikTok</label>
              <input name="tiktok_handle" type="text" placeholder="@" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date of Birth</label>
            <input name="dob" required type="date" className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none transition-colors" />
          </div>
          <div className="pt-8">
            <button disabled={state === 'submitting'} className="w-full bg-black text-white h-16 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex justify-between px-8 items-center group">
              {state === 'submitting' ? 'Processing...' : 'Submit Application'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black text-white py-20 px-6 border-t border-zinc-900">
    <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter mb-6">LUXIERIA.</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <p>Los Angeles • Miami • New York</p>
          <p>casting@luxieriastyle.com</p>
        </div>
      </div>
      <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
        <a href="/portal" className="hover:text-white text-white">Talent Portal</a>
      </div>
    </div>
  </footer>
);

// --- MAIN APP WRAPPER ---

const MainSite = ({ mobileMenuOpen, setMobileMenuOpen }) => (
  <>
    <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
    <main>
      <Hero />
      <AgencyMetrics />
      <TalentBoard />
      <Application />
    </main>
    <Footer />
  </>
);

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPortal, setIsPortal] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&family=Playfair+Display:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    if (window.location.pathname === '/portal') setIsPortal(true);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="font-sans antialiased bg-white text-black">
      <style>{`
        :root { --font-sans: 'Inter', sans-serif; --font-serif: 'Playfair Display', serif; }
        .font-sans { font-family: var(--font-sans); }
        .font-serif { font-family: var(--font-serif); }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      
      {isPortal ? <CastingPortal /> : <MainSite mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />}
      {<Analytics />}
    </div>
  );
};

export default App;
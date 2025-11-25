import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react'; // UNCOMMENT FOR PRODUCTION
import emailjs from '@emailjs/browser'; // UNCOMMENT FOR PRODUCTION
import { Camera, Instagram, Mail, Menu, X, Star, Tv, TrendingUp, ArrowRight, CheckCircle, ChevronDown, Plus, Minus, Quote, Lock, UploadCloud } from 'lucide-react';

/* --- CONFIGURATION --- */
const CASTING_ID = "LUX2025";  // The ID models must enter
const CASTING_PIN = "9988";    // The PIN models must enter
const CLOUDINARY_CLOUD_NAME = "dobrbqjwm"; // GET THIS FROM CLOUDINARY
const CLOUDINARY_PRESET = "luxieria_uploads"; // GET THIS FROM CLOUDINARY

const BRAND = {
  name: "LUXIERIA STYLE",
  tagline: "Defining Modern Elegance",
  colors: {
    gold: "text-yellow-600",
    bgGold: "bg-yellow-600",
    borderGold: "border-yellow-600",
  }
};

// --- CASTING PORTAL COMPONENT (Private) ---
const CastingPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputId, setInputId] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, success
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputId === CASTING_ID && inputPin === CASTING_PIN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Casting ID or PIN');
    }
  };

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      alert("Upload widget not loaded. Refresh the page.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_PRESET,
        sources: ['local', 'camera'], 
        maxFiles: 50,
        clientAllowedFormats: ['image', 'video'], 
        styles: {
          palette: {
            window: "#000000",
            windowBorder: "#D4AF37",
            tabIcon: "#D4AF37",
            menuIcons: "#D4AF37",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#D4AF37",
            action: "#D4AF37",
            inactiveTabIcon: "#666666",
            error: "#FF0000",
            inProgress: "#D4AF37",
            complete: "#20B832",
            sourceBg: "#1a1a1a"
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log('Done! Here is the file info: ', result.info);
          setUploadedUrl(result.info.secure_url);
          setUploadStatus('success');
          
          // UNCOMMENT THIS TO RECEIVE EMAIL NOTIFICATIONS FOR UPLOADS
          emailjs.send('service_c7gu1qs', 'template_03aeqt5', {
            casting_id: CASTING_ID,
            file_url: result.info.secure_url,
            file_type: result.info.format
          }, 'RlOcxI1To8sBKyXlJ'); 
          
        }
      }
    );
    widget.open();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-8 md:p-12 border border-zinc-800 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center text-yellow-600">
            <Lock size={48} />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">Private Portal</h2>
          <p className="text-gray-400 text-sm mb-8">Restricted access for casting candidates only.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Casting ID"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-4 text-white text-center tracking-widest focus:border-yellow-600 outline-none uppercase"
            />
            <input 
              type="password" 
              placeholder="PIN"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-4 text-white text-center tracking-widest focus:border-yellow-600 outline-none"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button className="w-full bg-yellow-600 text-black font-bold py-4 hover:bg-white transition-colors uppercase tracking-widest text-xs">
              Access Portal
            </button>
          </form>
          <a href="/" className="block mt-6 text-zinc-500 text-xs hover:text-white">← Return to Website</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Upload Materials</h2>
        <p className="text-gray-500 mb-10">Please upload your digitals or casting tape below. Video files may take a moment to process.</p>
        
        {uploadStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 p-8 rounded-lg">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-serif text-2xl text-green-800 mb-2">Upload Complete</h3>
            <p className="text-green-700 text-sm break-all">File Reference: {uploadedUrl.slice(-10)}</p>
            <p className="text-gray-500 text-xs mt-4">The casting team has been notified.</p>
            <button onClick={() => setUploadStatus('idle')} className="mt-6 text-xs uppercase underline font-bold">Upload another file</button>
          </div>
        ) : (
          <button 
            onClick={openUploadWidget}
            className="group w-full border-2 border-dashed border-gray-300 p-12 hover:border-yellow-600 hover:bg-yellow-50 transition-all cursor-pointer flex flex-col items-center"
          >
            <UploadCloud size={64} className="text-gray-300 group-hover:text-yellow-600 mb-4 transition-colors" />
            <span className="font-serif text-xl text-gray-900 mb-2">Click to Upload</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Images or Video (Max 50MB)</span>
          </button>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-100">
           <a href="/" className="text-xs uppercase tracking-widest text-gray-400 hover:text-black">Log Out</a>
        </div>
      </div>
    </div>
  );
};

// --- PUBLIC WEBSITE COMPONENTS ---

const Navigation = ({ activeSection, scrollToSection, mobileMenuOpen, setMobileMenuOpen }) => {
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Talent', id: 'talent' },
    { name: 'Services', id: 'services' },
    { name: 'Apply', id: 'apply' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="font-serif text-2xl tracking-widest font-bold text-black">
              LUXIERIA<span className={BRAND.colors.gold}>.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-yellow-600 ${
                  activeSection === link.id ? 'text-black' : 'text-gray-500'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('apply')}
              className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              Cast Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-black p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 py-4 px-4 flex flex-col space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                scrollToSection(link.id);
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = ({ scrollToSection }) => {
  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
          alt="High Fashion Model" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-16">
        <h2 className="text-xs md:text-sm font-light tracking-[0.3em] uppercase mb-4 text-yellow-500 animate-fade-in-up">
          Modeling & Casting Agency
        </h2>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight leading-tight">
          The New Era of <br/><span className="italic text-gray-300">Stardom</span>
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
          We discover the faces of tomorrow for high-end fashion, swimwear, and iconic reality television.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => scrollToSection('apply')}
            className="bg-white text-black px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Apply Now
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="border border-white text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
          >
            Discover More
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white opacity-50" size={32} />
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" 
                alt="Model Close up" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-50 -z-10 border border-gray-200"></div>
          </div>
          
          <div>
            <span className={`block text-xs font-bold uppercase tracking-widest mb-4 ${BRAND.colors.gold}`}>
              Who We Are
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-black mb-8 leading-tight">
              Where Elegance Meets <br/> <span className="italic">Opportunity.</span>
            </h2>
            <div className="space-y-6 text-gray-600 font-light leading-relaxed">
              <p>
                Luxieria Style is more than a modeling agency; we are a gateway to the global stage. Based on a foundation of inclusivity and high-fashion aesthetics, we specialize in scouting fresh talent for commercial print, runway, and swimsuit editorials.
              </p>
              <p>
                Beyond the lens, we are a premier casting partner for some of television's most watched reality formats. From the villas of <strong className="text-black font-medium">Love Island</strong> to the pods of <strong className="text-black font-medium">Love is Blind</strong>, our talent roster is curated for personality, presence, and star power.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-3xl text-black">500+</h4>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Placements</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl text-black">50+</h4>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Brand Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Camera size={32} />,
      title: "Fashion & Editorial",
      desc: "Representing diverse faces for high-end fashion, commercial catalogs, and runway shows. We focus on swimsuit and streetwear campaigns.",
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: <Tv size={32} />,
      title: "Reality TV Casting",
      desc: "Direct casting pipelines to major networks. We prepare and pitch personalities for shows like Love Island, The Bachelor, and Love is Blind.",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1974&auto=format&fit=crop"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Influencer Management",
      desc: "Building personal brands. We help models transition into full-time influencers with strategy, partnerships, and media training.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${BRAND.colors.gold}`}>Our Expertise</span>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 text-black">Curating Careers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="group bg-white p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 mb-6 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className={`mb-4 ${BRAND.colors.gold}`}>{service.icon}</div>
              <h3 className="font-serif text-xl mb-3 text-black">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
              <a href="#apply" className="inline-flex items-center text-xs uppercase font-bold tracking-widest hover:text-yellow-600 transition-colors">
                Apply for this <ArrowRight size={14} className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Talent = () => {
  const [showAll, setShowAll] = useState(false);

  // Expanded roster data
  const models = [
    { name: "Sienna M.", height: "5'9", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop", tags: ["Editorial", "Swim"] },
    { name: "Marcus J.", height: "6'2", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop", tags: ["Commercial", "TV"] },
    { name: "Elena R.", height: "5'10", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop", tags: ["Runway", "Love Island"] },
    { name: "David K.", height: "6'1", img: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=2070&auto=format&fit=crop", tags: ["Fitness", "Print"] },
    { name: "Zara B.", height: "5'8", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop", tags: ["Lifestyle", "Influencer"] },
    { name: "Leo T.", height: "6'0", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop", tags: ["Streetwear", "Acting"] },
    { name: "Amara L.", height: "5'11", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop", tags: ["High Fashion", "Runway"] },
    { name: "Julian P.", height: "6'3", img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1887&auto=format&fit=crop", tags: ["Suiting", "Catalog"] }
  ];

  const displayedModels = showAll ? models : models.slice(0, 4);

  return (
    <section id="talent" className="py-24 bg-black text-white transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${BRAND.colors.gold}`}>Our Roster</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3">Featured Talent</h2>
          </div>
          
          <button 
            onClick={() => setShowAll(!showAll)}
            className="hidden md:flex items-center text-xs uppercase tracking-widest border-b border-white pb-1 hover:text-yellow-500 hover:border-yellow-500 transition-all group"
          >
            {showAll ? (
              <>
                View Less <Minus size={14} className="ml-2 group-hover:rotate-180 transition-transform" />
              </>
            ) : (
              <>
                View All Models <Plus size={14} className="ml-2 group-hover:rotate-90 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {displayedModels.map((model, idx) => (
            <div key={idx} className="group relative cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-zinc-900">
                <img 
                  src={model.img} 
                  alt={model.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <h3 className="font-serif text-lg text-white">{model.name}</h3>
                <p className="text-xs text-gray-300 uppercase tracking-wider">{model.height} • {model.tags.join(" / ")}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Button */}
        <div className="mt-8 text-center md:hidden">
           <button 
             onClick={() => setShowAll(!showAll)}
             className="text-xs uppercase tracking-widest border-b border-white pb-1 inline-flex items-center"
           >
            {showAll ? "View Less" : "View All Models"}
            {showAll ? <Minus size={14} className="ml-2" /> : <Plus size={14} className="ml-2" />}
          </button>
        </div>
      </div>
    </section>
  );
};

const SuccessStories = () => {
  const stories = [
    {
      name: "Bella Rivera",
      age: "21",
      result: "Cast on Love Island USA",
      quote: "I was just posting selfies on Instagram when Luxieria DM'd me. They coached me through the entire casting tape process. Three months later, I was flying to the villa!",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Chloe Davis",
      age: "19",
      result: "Campaign for Oh Polly",
      quote: "I'm under 5'7 so I thought I couldn't model. Luxieria saw my potential for commercial swim and lifestyle. Booking my first global campaign was a dream come true.",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop"
    },
    {
      name: "Jasmine Chen",
      age: "22",
      result: "Full-Time Influencer",
      quote: "Transitioning from a student to a full-time creator was scary. The agency helped me negotiate brand deals I didn't even know I could get.",
      img: "https://images.unsplash.com/photo-1616002411355-49593fd89721?q=80&w=1964&auto=format&fit=crop"
    }
  ];

  return (
    <section id="stories" className="py-24 bg-zinc-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${BRAND.colors.gold}`}>Real Results</span>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 text-black">Success Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-600/20">
                  <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-black">{story.name}</h4>
                  <p className="text-xs text-yellow-600 uppercase tracking-wider font-bold">{story.result}</p>
                </div>
              </div>
              <Quote className="text-gray-200 mb-4 h-8 w-8" />
              <p className="text-gray-600 text-sm leading-relaxed italic mb-4">
                "{story.quote}"
              </p>
              <div className="text-xs text-gray-400 font-medium">
                — Age {story.age}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplicationForm = () => {
  const [formState, setFormState] = useState('idle'); // idle, submitting, success
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');

   

    
    emailjs.sendForm('service_c7gu1qs', 'template_xk0m9ad', form.current, 'RlOcxI1To8sBKyXlJ')
      .then((result) => {
          setFormState('success');
      }, (error) => {
          console.log(error.text);
          alert("There was an error submitting your application.");
          setFormState('idle');
      });
    
  };

  return (
    <section id="apply" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <span className={`text-xs font-bold uppercase tracking-widest ${BRAND.colors.gold}`}>Join The Agency</span>
           <h2 className="font-serif text-3xl md:text-5xl mt-3 text-black">Be Discovered</h2>
           <p className="mt-4 text-gray-500 font-light">
             Apply now for representation in fashion modeling or casting consideration for upcoming reality TV projects.
           </p>
        </div>

        <div className="bg-zinc-50 p-8 md:p-12 shadow-sm border border-zinc-100">
          {formState === 'success' ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-2">Application Received</h3>
              <p className="text-gray-500 mb-6">Thank you for submitting to Luxieria. Our casting directors will review your profile and contact you via Email if there is a fit.</p>
              <button 
                onClick={() => setFormState('idle')}
                className="text-xs uppercase font-bold tracking-widest text-black border-b border-black pb-1 hover:text-yellow-600 hover:border-yellow-600"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form ref={form} onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <input name="user_name" required type="text" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-yellow-600 transition-colors" placeholder="e.g. Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <input name="user_email" required type="email" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-yellow-600 transition-colors" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">@</span>
                    <input name="instagram_handle" required type="text" className="w-full bg-white border border-gray-200 p-3 pl-8 text-sm focus:outline-none focus:border-yellow-600 transition-colors" placeholder="luxieriastyle" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">TikTok Profile</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">@</span>
                    <input name="tiktok_handle" type="text" className="w-full bg-white border border-gray-200 p-3 pl-8 text-sm focus:outline-none focus:border-yellow-600 transition-colors" placeholder="luxieriastyle" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Date of Birth</label>
                  <input name="dob" required type="date" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-yellow-600 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">I am interested in (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Fashion Modeling', 'Swimwear / Lingerie', 'Reality TV Casting', 'Influencer Representation'].map((opt) => (
                    <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                      <input name="interests" value={opt} type="checkbox" className="form-checkbox h-4 w-4 text-black border-gray-300 rounded focus:ring-yellow-600" />
                      <span className="text-sm text-gray-700 group-hover:text-black">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Experience / Bio</label>
                <textarea name="message" rows="4" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-yellow-600 transition-colors" placeholder="Tell us about yourself, previous work, or why you want to join Reality TV..."></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={formState === 'submitting'}
                  className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'submitting' ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-2xl tracking-widest font-bold text-white mb-6">
              LUXIERIA<span className="text-yellow-600">.</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
              The premier destination for new face modeling and reality television casting. We bridge the gap between high fashion and pop culture.
            </p>
            {/* Social Icons Removed */}
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Agency</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#talent" className="hover:text-white transition-colors">Talent Board</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#stories" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">●</span> Miami, FL / Los Angeles, CA
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">●</span> Mon-Fri: 9am - 6pm
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 Luxieria Style. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MainSite = ({ activeSection, scrollToSection, mobileMenuOpen, setMobileMenuOpen }) => (
  <>
    <Navigation activeSection={activeSection} scrollToSection={scrollToSection} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
    <main>
      <Hero scrollToSection={scrollToSection} />
      <About />
      <Services />
      <Talent />
      <SuccessStories />
      <ApplicationForm />
    </main>
    <Footer />
  </>
);

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPortal, setIsPortal] = useState(false);

  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Simple routing check
    if (window.location.pathname === '/portal') {
      setIsPortal(true);
    }

    return () => document.head.removeChild(link);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    if (isPortal) return;
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'talent', 'stories', 'apply'];
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortal]);

  return (
    <div className="font-sans antialiased bg-white selection:bg-yellow-200 selection:text-black">
      <style>{`
        :root { --font-serif: 'Playfair Display', serif; --font-sans: 'Montserrat', sans-serif; }
        .font-serif { font-family: var(--font-serif); } .font-sans { font-family: var(--font-sans); }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}</style>
      
      {isPortal ? (
        <CastingPortal />
      ) : (
        <MainSite 
          activeSection={activeSection} 
          scrollToSection={scrollToSection} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
      )}
      
      {/* <Analytics /> */}
    </div>
  );
};

export default App;
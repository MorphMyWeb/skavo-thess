import { useState, useEffect, FormEvent } from 'react';
import { 
  Phone, Mail, MapPin, Shield, Clock, Truck, HardHat, Star, 
  MessageSquare, CheckCircle2, Menu, X, Send, Hammer, Trees, 
  Droplets, Award, ChevronRight, ChevronLeft, FileText, Sparkles, Building2, 
  Trash2, ArrowUpRight, HelpCircle, Check, Users
} from 'lucide-react';

// Import our custom generated assets using Vite's path resolution
import heroImage from './assets/images/hero_excavator_1782395160121.jpg';
import miniImage from './assets/images/mini_excavator_1782395189074.jpg';
import { Logo } from './components/Logo';
import { Review, DEFAULT_REVIEWS } from './data/reviews';

interface Quote {
  id: string;
  type: 'quote' | 'message';
  name: string;
  phoneOrEmail: string;
  areaOrSubject: string;
  description: string;
  date: string;
}

export default function App() {
  // Mobile navigation toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamic Toast message state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Form states
  const [formType, setFormType] = useState<'quote' | 'message'>('quote');
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    area: '',
    description: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Privacy Policy states
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [quotePrivacyAccepted, setQuotePrivacyAccepted] = useState(false);
  const [contactPrivacyAccepted, setContactPrivacyAccepted] = useState(false);

  // Submitted items (persisted in localStorage for demo review)
  const [submissions, setSubmissions] = useState<Quote[]>([]);
  const [showAdminDrawer, setShowAdminDrawer] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(1);

  // Responsive reviews count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setReviewsPerPage(2);
      } else {
        setReviewsPerPage(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modal to add a review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    text: ''
  });

  // Selected machine for auto-populating quote
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSubs = localStorage.getItem('skavo_thess_submissions');
    if (savedSubs) {
      try {
        setSubmissions(JSON.parse(savedSubs));
      } catch (e) {
        console.error('Failed to parse saved submissions', e);
      }
    }

    const savedReviews = localStorage.getItem('skavo_thess_reviews');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews) as Review[];
        const customReviews = parsed.filter(r => !DEFAULT_REVIEWS.some(dr => dr.id === r.id));
        setReviews([...customReviews, ...DEFAULT_REVIEWS]);
      } catch (e) {
        console.error('Failed to parse saved reviews', e);
      }
    }
  }, []);

  // Save submissions helper
  const saveSubmissions = (newSubs: Quote[]) => {
    setSubmissions(newSubs);
    localStorage.setItem('skavo_thess_submissions', JSON.stringify(newSubs));
  };

  // Toast trigger helper
  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Submit quote form handler
  const handleQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.area || !quoteForm.description) {
      triggerToast('Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία.', 'info');
      return;
    }

    if (!quotePrivacyAccepted) {
      triggerToast('Παρακαλούμε αποδεχτείτε την Πολιτική Απορρήτου για να συνεχίσετε.', 'info');
      return;
    }

    const newSub: Quote = {
      id: 'sub-' + Date.now(),
      type: 'quote',
      name: quoteForm.name,
      phoneOrEmail: quoteForm.phone,
      areaOrSubject: quoteForm.area,
      description: quoteForm.description,
      date: new Date().toLocaleString('el-GR')
    };

    const updated = [newSub, ...submissions];
    saveSubmissions(updated);
    triggerToast('Η προσφορά σας καταχωρήθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας άμεσα.');
    
    // Clear form
    setQuoteForm({
      name: '',
      phone: '',
      area: '',
      description: ''
    });
    setQuotePrivacyAccepted(false);
    setSelectedMachine(null);
  };

  // Submit contact form handler
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      triggerToast('Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία.', 'info');
      return;
    }

    if (!contactPrivacyAccepted) {
      triggerToast('Παρακαλούμε αποδεχτείτε την Πολιτική Απορρήτου για να συνεχίσετε.', 'info');
      return;
    }

    const newSub: Quote = {
      id: 'sub-' + Date.now(),
      type: 'message',
      name: contactForm.name,
      phoneOrEmail: contactForm.email,
      areaOrSubject: contactForm.subject,
      description: contactForm.message,
      date: new Date().toLocaleString('el-GR')
    };

    const updated = [newSub, ...submissions];
    saveSubmissions(updated);
    triggerToast('Το μήνυμά σας στάλθηκε με επιτυχία! Θα σας απαντήσουμε το συντομότερο.');
    
    // Clear form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setContactPrivacyAccepted(false);
  };

  // Add review handler
  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.text) {
      triggerToast('Παρακαλούμε συμπληρώστε το όνομά σας και την αξιολόγηση.', 'info');
      return;
    }

    // Generate initials
    const nameParts = newReview.author.trim().split(' ');
    const initials = nameParts.map(p => p[0]?.toUpperCase() || '').join('').slice(0, 2) || 'G';

    const item: Review = {
      id: 'rev-' + Date.now(),
      author: newReview.author,
      rating: newReview.rating,
      timeAgo: 'Μόλις τώρα',
      text: newReview.text,
      initials
    };

    const updatedReviews = [item, ...reviews];
    setReviews(updatedReviews);
    setCurrentReviewIdx(0);
    localStorage.setItem('skavo_thess_reviews', JSON.stringify(updatedReviews));

    triggerToast('Σας ευχαριστούμε θερμά για την κριτική σας!');
    setIsReviewModalOpen(false);
    setNewReview({
      author: '',
      rating: 5,
      text: ''
    });
  };

  // Delete submission
  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter(s => s.id !== id);
    saveSubmissions(updated);
    triggerToast('Η καταχώρηση διαγράφηκε.', 'info');
  };

  // Click machine to auto-quote
  const selectMachineForQuote = (machineName: string) => {
    setSelectedMachine(machineName);
    setFormType('quote');
    setQuoteForm(prev => ({
      ...prev,
      description: `Ενδιαφέρομαι για χωματουργικές εργασίες με χρήση του εξοπλισμού: ${machineName}. `
    }));
    triggerToast(`Επιλέχθηκε: ${machineName}. Συμπληρώστε τα στοιχεία σας στη φόρμα.`);
    
    const element = document.getElementById('contact-quote-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Click area keyword to set area field
  const selectAreaForQuote = (areaName: string) => {
    setFormType('quote');
    setQuoteForm(prev => ({
      ...prev,
      area: areaName
    }));
    triggerToast(`Επιλέχθηκε περιοχή: ${areaName}`);
    const element = document.getElementById('contact-quote-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slider navigation helpers
  const handleNextReview = () => {
    setCurrentReviewIdx(prev => {
      const maxIdx = reviews.length - reviewsPerPage;
      if (prev >= maxIdx) {
        return 0; // Wrap to beginning
      }
      return prev + 1;
    });
  };

  const handlePrevReview = () => {
    setCurrentReviewIdx(prev => {
      const maxIdx = reviews.length - reviewsPerPage;
      if (prev <= 0) {
        return Math.max(0, maxIdx); // Wrap to end
      }
      return prev - 1;
    });
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const displayRating = averageRating.toFixed(1);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#F27D26] selection:text-black overflow-x-hidden w-full max-w-full relative">
      
      {/* Dynamic Toast Notifications */}
      {toast && (
        <div id="toast-notification" className="fixed top-24 right-6 z-[100] max-w-sm animate-bounce flex items-center gap-3 p-4 rounded-lg shadow-xl border border-white/10 backdrop-blur-md bg-black/95 text-white">
          <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-[#F27D26] text-black' : 'bg-blue-600 text-white'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner / Contact Ribbon */}
      <div className="bg-[#121212] border-b border-white/5 py-2.5 px-4 sm:px-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <a href="tel:+306949114517" className="flex items-center gap-2 hover:text-[#F27D26] transition-colors font-mono">
              <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
              (+30) 694 911 4517
            </a>
            <a href="mailto:info@skavo-thess.gr" className="flex items-center gap-2 hover:text-[#F27D26] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
              info@skavo-thess.gr
            </a>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <MapPin className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>Περαία, Θεσσαλονίκης, 57019</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header id="main-header" className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <Logo variant="compact" color="primary" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold tracking-wider text-sm uppercase">
            <a href="#" className="hover:text-[#F27D26] text-[#F27D26] transition-colors">Αρχικη</a>
            <a href="#about-section" className="hover:text-[#F27D26] transition-colors">Σχετικα με Εμας</a>
            <a href="#services-section" className="hover:text-[#F27D26] transition-colors">Υπηρεσιες</a>
            <a href="#reviews-section" className="hover:text-[#F27D26] transition-colors">Κριτικες</a>
            <a href="#contact-quote-section" className="hover:text-[#F27D26] transition-colors">Επικοινωνια</a>
          </nav>

          {/* Desktop Call Action */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+306949114517" 
              className="px-5 py-2.5 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold rounded text-xs uppercase tracking-widest flex items-center gap-2 transition duration-300 shadow-md shadow-[#F27D26]/10"
            >
              <Phone className="w-4 h-4" />
              694 911 4517
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-3 text-gray-300 hover:text-[#F27D26] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0D0D0D] border-t border-white/5 py-4 px-6 space-y-4 font-semibold tracking-wide text-sm uppercase">
            <a 
              href="#" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-2 text-[#F27D26] border-b border-white/5"
            >
              Αρχικη
            </a>
            <a 
              href="#about-section" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-2 text-gray-300 hover:text-[#F27D26] border-b border-white/5"
            >
              Σχετικα με Εμας
            </a>
            <a 
              href="#services-section" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-2 text-gray-300 hover:text-[#F27D26] border-b border-white/5"
            >
              Υπηρεσιες
            </a>
            <a 
              href="#reviews-section" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-2 text-gray-300 hover:text-[#F27D26] border-b border-white/5"
            >
              Κριτικες
            </a>
            <a 
              href="#contact-quote-section" 
              onClick={() => setIsMenuOpen(false)} 
              className="block py-2 text-gray-300 hover:text-[#F27D26]"
            >
              Επικοινωνια
            </a>
            <div className="pt-2 flex flex-col gap-3">
              <a 
                href="tel:+306949114517" 
                className="w-full py-3 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold rounded text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                ΚΑΛΕΣΤΕ ΜΑΣ
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[600px] lg:min-h-[680px] flex items-center justify-center py-8 md:py-20 px-4 sm:px-8 overflow-hidden">
        
        {/* Background Image with Dark Overlays (Desktop/Tablet only) */}
        <div className="hidden md:block absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Excavator at construction site in Thessaloniki" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.55] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/20 z-10"></div>
          
          {/* Accent Glow Circle */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#F27D26]/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-[150px] pointer-events-none"></div>
        </div>

        {/* Ambient glows for mobile */}
        <div className="md:hidden absolute inset-0 z-0 bg-[#0A0A0A]">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#F27D26]/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-amber-600/5 blur-[120px] pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Entire Hero Image displayed on mobile to avoid cropping */}
          <div className="md:hidden w-full overflow-hidden rounded-lg border border-white/10 shadow-lg mt-4">
            <img 
              src={heroImage} 
              alt="Excavator at construction site in Thessaloniki" 
              className="w-full h-auto object-contain filter contrast-[1.05]"
            />
          </div>
          
          {/* Main Hero Header */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-[#F27D26]/10 border border-[#F27D26]/35 px-3 py-1.5 rounded text-[#F27D26] text-xs font-black uppercase tracking-widest animate-pulse">
              <HardHat className="w-4 h-4" />
              <span>Αμεση Εξυπηρετηση 24/7 σε Ολη τη Θεσσαλονικη</span>
            </div>

            {/* H1 Primary Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
              Χωματουργικές Εργασίες <br />
              <span className="text-[#F27D26] inline-block mt-1 relative">
                Θεσσαλονίκη
                <span className="absolute bottom-1.5 left-0 w-full h-[6px] bg-[#F27D26]/30 -skew-x-12"></span>
              </span> 
              <span className="text-gray-300 font-light"> | Skavo-Thess</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed">
              Άμεση εξυπηρέτηση, σύγχρονος στόλος και εξειδικευμένες λύσεις για κάθε είδους εκσκαφή και χωματουργικό έργο. Σκάβουμε στην ποιότητα, χτίζουμε στην αξιοπιστία.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="#contact-quote-section" 
                className="px-8 py-4 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-black uppercase text-xs tracking-widest rounded-sm transition-transform hover:-translate-y-0.5 duration-200 shadow-lg shadow-[#F27D26]/20 flex items-center gap-2"
              >
                <FileText className="w-4.5 h-4.5" />
                Ζητηστε Προσφορα
              </a>
              <a 
                href="tel:+306949114517" 
                className="px-8 py-4 border border-white/20 hover:border-[#F27D26] hover:bg-[#F27D26]/5 text-white font-black uppercase text-xs tracking-widest rounded-sm transition duration-200 flex items-center gap-2"
              >
                <Phone className="w-4.5 h-4.5 text-[#F27D26]" />
                Καλεστε Μας
              </a>
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 max-w-xl">
              <div>
                <p className="text-[#F27D26] font-mono text-xl font-bold">100%</p>
                <p className="text-xs text-gray-400">Ιδιόκτητος Στόλος</p>
              </div>
              <div>
                <p className="text-[#F27D26] font-mono text-xl font-bold">5.0 ★</p>
                <p className="text-xs text-gray-400">{reviews.length} Google Κριτικές</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[#F27D26] font-mono text-xl font-bold">Άμεση</p>
                <p className="text-xs text-gray-400">Δωρεάν Εκτίμηση</p>
              </div>
            </div>

          </div>

          {/* Slogan Hero Badge / Badge Card */}
          <div className="lg:col-span-4 block">
            <div className="bg-[#121212]/90 border border-white/10 rounded-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F27D26]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#F27D26]/10"></div>
              
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <Award className="w-6 h-6 text-[#F27D26]" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-gray-300">Skavo-Thess Moto</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black mb-4 leading-tight">
                "Σκάβουμε στην ποιότητα, <br />
                <span className="text-[#F27D26]">Χτίζουμε στην Αξιοπιστία!</span>"
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Δεσμευόμαστε να προσφέρουμε υπηρεσίες υψηλών προδιαγραφών στη Θεσσαλονίκη, βάζοντας πάντα την ασφάλεια και τις δικές σας ανάγκες σε πρώτο πλάνο.
              </p>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Check className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Ασφάλεια &amp; Πιστοποίηση</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Check className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Ακριβή Χρονοδιαγράμματα</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Welcome & Slogan Section */}
      <section id="about-section" className="py-20 px-4 sm:px-8 bg-[#0D0D0D] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F27D26]/3 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#F27D26] text-xs font-black uppercase tracking-[0.25em] mb-3 flex items-center justify-center gap-2">
              <span className="w-6 h-[1px] bg-[#F27D26]"></span> 
              ΚΑΛΩΣΟΡΙΣΑΤΕ ΣΤΗΝ ΟΜΑΔΑ ΤΟΥ SKAVO-THESS 
              <span className="w-6 h-[1px] bg-[#F27D26]"></span>
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Strong Hand | <span className="text-[#F27D26]">We Build Your Dream</span>
            </h3>
            <div className="w-16 h-1 bg-[#F27D26] mx-auto mb-6"></div>
            <p className="text-lg text-gray-200 font-semibold italic">
              «Εξειδικευμένες Χωματουργικές Εργασίες για Κάθε σας Ανάγκη Μικρή και Μεγάλη.»
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Mission Left Block */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-lg flex flex-col justify-between">
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed text-base">
                  Στη <span className="text-[#F27D26] font-semibold">Skavo-Thess.gr</span>, προσφέρουμε ολοκληρωμένες λύσεις σε όλες τις χωματουργικές εργασίες εξυπηρετώντας τόσο ιδιώτες όσο και επαγγελματίες (εργολάβους, τεχνικά γραφεία).
                </p>
                <p className="text-gray-300 leading-relaxed text-base">
                  Ως μια νεοσύστατη εταιρεία, είμαστε αφοσιωμένοι στην παροχή υπηρεσιών υψηλής ποιότητας και στη δημιουργία ισχυρών σχέσεων με τους πελάτες μας. Δεσμευόμαστε για τον επαγγελματισμό, την ποιότητα και τις προσιτές τιμές μας.
                </p>
                <p className="text-gray-300 leading-relaxed text-base">
                  Έχοντας μια προηγμένη τεχνογνωσία, εγγυόμαστε άριστη ποιότητα και άμεση εξυπηρέτηση σε κάθε έργο που αναλαμβάνουμε. Εδώ θα βρείτε όλες τις πληροφορίες που χρειάζεστε για τις υπηρεσίες, τα έργα μας και τον τρόπο που μπορούμε να συμβάλλουμε στην επιτυχία του δικού σας έργου.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#F27D26]">Skavo Thess Motto</h4>
                  <p className="text-xs text-gray-400 italic">«Σκάβουμε στην ποιότητα, Χτίζουμε στην Αξιοπιστία!»</p>
                </div>
                <a 
                  href="#contact-quote-section" 
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white hover:text-[#F27D26] transition"
                >
                  ΖΗΤΗΣΤΕ ΔΩΡΕΑΝ ΕΚΤΙΜΗΣΗ
                  <ArrowUpRight className="w-4 h-4 text-[#F27D26]" />
                </a>
              </div>
            </div>

            {/* About Right Block */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#121212] to-[#181818] border border-white/10 p-8 sm:p-10 rounded-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D26]/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#F27D26] font-black">Σχετικα με Εμας</span>
                <h3 className="text-2xl font-black text-white">WE BUILT YOUR DREAM!</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Η <span className="text-white font-bold">Skavo-Thess</span> είναι μία νέα και καινοτόμος εταιρεία που δραστηριοποιείται στον τομέα των χωματουργικών εργασιών, φέρνοντας σύγχρονο πνεύμα και απόλυτη αξιοπιστία στην αγορά.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Όραμά μας να προσφέρουμε υψηλής ποιότητας υπηρεσίες στη Θεσσαλονίκη και τις γύρω περιοχές, υποστηρίζοντας την τοπική ανάπτυξη και προσφέροντας σιγουριά σε κάθε πελάτη.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-3 bg-white/5 rounded border border-white/5 flex items-center gap-3">
                  <div className="p-2 bg-[#F27D26]/10 text-[#F27D26] rounded">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">Οδηγοί &amp; Αρχές μας:</h5>
                    <p className="text-[11px] text-[#F27D26] font-bold">Ασφάλεια, Ποιότητα, Αξιοπιστία, Συνεργασία</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-choose-us" className="py-20 px-4 sm:px-8 bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#F27D26] text-xs font-black uppercase tracking-[0.25em] mb-3">
              VALUE PROPOSITION
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Γιατί Να Επιλέξετε <span className="text-[#F27D26]">Εμάς</span>
            </h3>
            <p className="text-sm text-gray-400 mt-3">
              Χτίζουμε σχέσεις εμπιστοσύνης με κάθε ιδιώτη και επαγγελματία, προσφέροντας απαράμιλλη ποιότητα.
            </p>
            <div className="w-12 h-[3px] bg-[#F27D26] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Advantage 1 */}
            <div className="bg-[#111111] border border-white/5 p-6 rounded-lg hover:border-[#F27D26]/40 transition duration-300 group">
              <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center mb-5 group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold uppercase tracking-wider mb-3 group-hover:text-[#F27D26] transition-colors">
                Ιδιόκτητος &amp; Σύγχρονος Στόλος
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Διαθέτουμε ευέλικτα μικρά και μεγάλα εκσκαπτικά μηχανήματα για κάθε χώρο (στενά περάσματα, εσωτερικές αυλές, μεγάλα οικόπεδα).
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-[#111111] border border-white/5 p-6 rounded-lg hover:border-[#F27D26]/40 transition duration-300 group">
              <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center mb-5 group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold uppercase tracking-wider mb-3 group-hover:text-[#F27D26] transition-colors">
                Πολυετής Εμπειρία &amp; Ασφάλεια
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Έμπειροι χειριστές που εγγυώνται την ασφαλή και ακριβή διεκπεραίωση του έργου, χωρίς φθορές σε γύρω δίκτυα (ύδρευση, αέριο).
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-[#111111] border border-white/5 p-6 rounded-lg hover:border-[#F27D26]/40 transition duration-300 group">
              <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center mb-5 group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold uppercase tracking-wider mb-3 group-hover:text-[#F27D26] transition-colors">
                Συνέπεια στα Χρονοδιαγράμματα
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Παράδοση του έργου στον προκαθορισμένο χρόνο, χωρίς κρυφές χρεώσεις, καθυστερήσεις ή απρόβλεπτα κόστη.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="bg-[#111111] border border-white/5 p-6 rounded-lg hover:border-[#F27D26]/40 transition duration-300 group">
              <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center mb-5 group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold uppercase tracking-wider mb-3 group-hover:text-[#F27D26] transition-colors">
                Κάλυψη Όλης της Θεσσαλονίκης
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Εξυπηρέτηση σε ανατολική, δυτική Θεσσαλονίκη, κέντρο, προάστια, καθώς και στην ευρύτερη περιφέρεια.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20 px-4 sm:px-8 bg-[#0D0D0D] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#F27D26] text-xs font-black uppercase tracking-[0.25em] mb-3">
              ΟΙ ΥΠΗΡΕΣΙΕΣ ΜΑΣ
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Υπηρεσίες Χωματουργικών <span className="text-[#F27D26]">Έργων</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Στη <span className="text-[#F27D26] font-bold">Skavo-Thess</span> παρέχουμε μια ευρεία γκάμα υπηρεσιών χωματουργικών εργασιών, που περιλαμβάνουν:
            </p>
            <div className="w-12 h-[3px] bg-[#F27D26] mx-auto mt-4"></div>
          </div>

          {/* Grouped Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Service 1: Κατασκευή */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  🏗️
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Κατασκευή</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Κατασκευή οδών και δρόμων, συμπεριλαμβανομένης της εκσκαφής και της επίστρωσης.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Κατασκευή')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 2: Μεταφορά υλικών */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  🚚
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Μεταφορά υλικών</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Φόρτωση και μεταφορά υλικών, όπως χώμα, άμμος, ορυκτά, ή οποιοδήποτε άλλο υλικό που απαιτείται για ένα έργο.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Μεταφορά υλικών')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 3: Αρδευτικά-Αποχετευτικά έργα */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  💧
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Αρδευτικά-Αποχετευτικά έργα</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Υπηρεσίες αντιπλημμυρικών έργων και τοποθέτηση βόθρων.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Αρδευτικά-Αποχετευτικά έργα')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 4: Κατεδάφιση */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  🔨
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Κατεδάφιση</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Κατεδάφιση κτιρίων-Εκβραχισμοί ή άλλων κατασκευών με χρήση σφύρας όπου απαιτείται.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Κατεδάφιση')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 5: Κατασκευή βόθρων */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  🕳️
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Κατασκευή βόθρων</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Διάνοιξη χαντακιών και τοποθέτηση αγωγων-καλωδίων.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Κατασκευή βόθρων')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 6: Καθαρισμός Οικοπέδων */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition duration-300">
                  🧹
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Καθαρισμός Οικοπέδων</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Καθαρισμοί και διαμορφώσεις οικοπέδων και εξωτερικών χώρων.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5">
                <button 
                  onClick={() => selectMachineForQuote('Καθαρισμός Οικοπέδων')}
                  className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                >
                  ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service 7: Εκσκαφές */}
            <div className="bg-[#121212] border border-white/5 rounded-lg p-6 sm:p-8 hover:border-[#F27D26]/40 transition duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-3">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-14 h-14 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center text-2xl group-hover:bg-[#F27D26] group-hover:text-black transition shrink-0 duration-300">
                  ⛏️
                </div>
                <div className="space-y-2 flex-grow">
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Εκσκαφές</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Εκσκαφή και απομάκρυνση χώματος για την κατασκευή θεμελίωσης ή στην προετοιμασία εδάφους για την κατασκευή κτιρίων.
                  </p>
                </div>
                <div className="pt-4 md:pt-0 shrink-0 border-t md:border-t-0 border-white/5">
                  <button 
                    onClick={() => selectMachineForQuote('Εκσκαφές')}
                    className="text-xs text-[#F27D26] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                  >
                    ΖΗΤΗΣΤΕ ΕΚΤΙΜΗΣΗ <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Slogan Intermission */}
          <div className="bg-[#151515] border border-[#F27D26]/20 p-6 rounded-lg text-center my-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#F27D26]/2 pointer-events-none"></div>
            <p className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
              «Skavo-Thess: <span className="text-[#F27D26]">Βάζουμε τα θεμέλια, Χτίζουμε την εμπιστοσύνη!</span>»
            </p>
          </div>

        </div>
      </section>


      {/* Testimonials / Google Reviews Section */}
      <section id="reviews-section" className="py-20 px-4 sm:px-8 bg-[#0D0D0D] border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-600/3 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
            
            {/* Rating Summary Block Left */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-[#F27D26] text-xs font-black uppercase tracking-[0.25em]">
                GOOGLE REVIEWS
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Τι Λένε οι <span className="text-[#F27D26]">Πελάτες μας</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Η ικανοποίηση των πελατών μας είναι η καλύτερη διαφήμιση για εμάς. Δείτε πραγματικές κριτικές από ανθρώπους που μας εμπιστεύτηκαν στη Θεσσαλονίκη.
              </p>

              {/* Real Google Star Stats Card */}
              <div className="bg-[#121212] border border-white/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white">{displayRating}</span>
                  <span className="text-xl font-bold text-gray-500">/ 5.0</span>
                </div>
                
                <div className="flex items-center gap-1 text-[#F27D26]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-gray-400">
                  Βασισμένο σε <span className="text-white font-bold">{reviews.length} Google κριτικές</span>
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-3 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    ΓΡΑΨΤΕ ΜΙΑ ΚΡΙΤΙΚΗ
                  </button>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 uppercase tracking-widest">
                  Επαληθεύτηκε από το <span className="text-white font-extrabold">Trustindex</span>
                </span>
              </div>
            </div>

            {/* Testimonials Slides Grid Right */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              
              {/* Carousel Controls Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-gray-500 font-mono">
                  {reviewsPerPage === 1 ? (
                    <>Κριτική {currentReviewIdx + 1} από {reviews.length}</>
                  ) : (
                    <>Κριτικές {currentReviewIdx + 1}-{Math.min(currentReviewIdx + reviewsPerPage, reviews.length)} από {reviews.length}</>
                  )}
                </span>
                
                {/* Arrow Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevReview}
                    className="w-10 h-10 rounded-full border border-white/10 hover:border-[#F27D26] hover:text-[#F27D26] bg-[#121212] flex items-center justify-center transition-all duration-300 group"
                    aria-label="Previous Review"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={handleNextReview}
                    className="w-10 h-10 rounded-full border border-white/10 hover:border-[#F27D26] hover:text-[#F27D26] bg-[#121212] flex items-center justify-center transition-all duration-300 group"
                    aria-label="Next Review"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Slider Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[360px] sm:min-h-[280px] md:min-h-[300px]">
                {reviews.slice(currentReviewIdx, currentReviewIdx + reviewsPerPage).map((review) => (
                  <div 
                    key={review.id} 
                    className="bg-[#121212] border border-white/5 p-6 rounded-lg hover:border-white/10 transition-all duration-300 flex flex-col justify-between relative h-full animate-in fade-in duration-350"
                  >
                    <div>
                      {/* Google Icon/Logo */}
                      <div className="absolute top-6 right-6 text-[10px] text-gray-600 font-extrabold select-none tracking-widest uppercase">
                        Google
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Initials Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30 flex items-center justify-center font-black text-sm uppercase shrink-0">
                          {review.initials}
                        </div>
                        
                        <div className="space-y-1 w-full">
                          <div className="flex flex-col justify-between">
                            <h4 className="font-extrabold text-sm text-white line-clamp-1">{review.author}</h4>
                            <span className="text-[10px] text-gray-500 font-mono">{review.timeAgo}</span>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 text-[#F27D26]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-5 italic">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Owner Reply if any */}
                    {review.reply && (
                      <div className="mt-4 p-3.5 bg-white/5 border-l-2 border-[#F27D26] rounded-r text-[11px] w-full">
                        <p className="font-extrabold text-gray-400 mb-0.5 text-[10px] uppercase tracking-wider">Απάντηση από τον ιδιοκτήτη</p>
                        <p className="text-gray-300 leading-normal line-clamp-3">{review.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Slider Dots / Indicators (Capped at 6 for clean visual presentation) */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const maxIdx = reviews.length - reviewsPerPage;
                  const activeDotIdx = Math.min(
                    Math.floor((currentReviewIdx / (maxIdx || 1)) * 5),
                    5
                  );
                  const isDotActive = idx === activeDotIdx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const targetIdx = Math.floor((idx / 5) * maxIdx);
                        setCurrentReviewIdx(Math.min(targetIdx, maxIdx));
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isDotActive ? 'w-6 bg-[#F27D26]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide section ${idx + 1}`}
                    />
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-lg max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-250">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-wide text-[#F27D26]">Γράψτε μια Κριτική</h3>
              <p className="text-xs text-gray-400">Μοιραστείτε την εμπειρία σας με τη Skavo-Thess.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Το Όνομά σας</label>
                <input 
                  type="text" 
                  required
                  placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Βαθμολογία (Αστέρια)</label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-[#F27D26] hover:scale-110 transition"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'fill-current' : 'text-gray-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Η Κριτική σας</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Γράψτε μας πώς σας φάνηκε η εξυπηρέτηση, ο στόλος και η συνέπειά μας..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded p-2.5 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold text-xs uppercase tracking-widest rounded transition-colors"
              >
                ΥΠΟΒΟΛΗ ΚΡΙΤΙΚΗΣ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Contact & Quote Form Section */}
      <section id="contact-quote-section" className="py-20 px-4 sm:px-8 bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact Details Column Left */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                <h2 className="text-[#F27D26] text-xs font-black uppercase tracking-[0.25em]">
                  ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ
                </h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Ζητήστε <span className="text-[#F27D26]">Δωρεάν Εκτίμηση</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Είμαστε εδώ για να συζητήσουμε τις ανάγκες σας και να σας προσφέρουμε μια αναλυτική προσφορά για το έργο σας, χωρίς καμία απολύτως δέσμευση.
                </p>
              </div>

              {/* Direct Info list */}
              <div className="space-y-6">
                
                {/* Phone Card */}
                <a 
                  href="tel:+306949114517" 
                  className="flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-lg hover:border-[#F27D26]/30 transition group"
                >
                  <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center shrink-0 group-hover:bg-[#F27D26] group-hover:text-black transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Τηλέφωνο Επικοινωνίας</h5>
                    <p className="text-base font-extrabold text-white font-mono mt-0.5">(+30) 694 911 4517</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Κάντε κλικ για άμεση κλήση (24/7)</p>
                  </div>
                </a>

                {/* Email Card */}
                <a 
                  href="mailto:info@skavo-thess.gr" 
                  className="flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-lg hover:border-[#F27D26]/30 transition group"
                >
                  <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center shrink-0 group-hover:bg-[#F27D26] group-hover:text-black transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Διεύθυνση Email</h5>
                    <p className="text-base font-extrabold text-white mt-0.5">info@skavo-thess.gr</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Απαντάμε μέσα σε 24 ώρες</p>
                  </div>
                </a>

                {/* Address Card */}
                <div className="flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-lg hover:border-[#F27D26]/30 transition group">
                  <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded flex items-center justify-center shrink-0 group-hover:bg-[#F27D26] group-hover:text-black transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Πού Βρισκόμαστε</h5>
                    <p className="text-xs font-bold text-white mt-0.5">
                      Οδό Κολοκοτρώνη και Παμπουδάκη,
                    </p>
                    <p className="text-xs text-gray-400">
                      (έναντι 1ου γυμνασίου Περαίας), Άνω Περαία, Θεσσ/νικης, 57019
                    </p>
                  </div>
                </div>

              </div>

              {/* Operating status banner */}
              <div className="p-4 bg-[#151515] border-l-2 border-[#F27D26] text-xs text-gray-400 rounded-r">
                <span className="font-bold text-white uppercase block mb-1">⏰ Ωράριο Λειτουργίας</span>
                Εξυπηρετούμε καθημερινά και Σαββατοκύριακα. Για επείγουσες ανάγκες (διαρροές αποχέτευσης, άμεσες κατεδαφίσεις), καλέστε μας απευθείας στο κινητό.
              </div>

            </div>

            {/* Form Column Right */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between">
              
              {/* Form Tab Header */}
              <div className="grid grid-cols-2 border-b border-white/10">
                <button
                  onClick={() => setFormType('quote')}
                  className={`py-4 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-colors flex items-center justify-center gap-2 px-2 text-center ${formType === 'quote' ? 'bg-[#1A1A1A] text-[#F27D26] border-b-2 border-[#F27D26]' : 'text-gray-400 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>ΖΗΤΗΣΤΕ ΠΡΟΣΦΟΡΑ</span>
                </button>
                <button
                  onClick={() => setFormType('message')}
                  className={`py-4 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-colors flex items-center justify-center gap-2 px-2 text-center ${formType === 'message' ? 'bg-[#1A1A1A] text-[#F27D26] border-b-2 border-[#F27D26]' : 'text-gray-400 hover:text-white'}`}
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>ΕΠΙΚΟΙΝΩΝΙΑ / EMAIL</span>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8 flex-1">
                
                {/* Form Option 1: Quote request */}
                {formType === 'quote' && (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    
                    {selectedMachine && (
                      <div className="p-3 bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26] text-xs font-bold rounded flex justify-between items-center">
                        <span>Επιλέχθηκε αυτόματα: {selectedMachine}</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setSelectedMachine(null);
                            setQuoteForm({ ...quoteForm, description: '' });
                          }} 
                          className="hover:text-white text-xs underline"
                        >
                          Ακύρωση
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Το Όνομά σας *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ονοματεπώνυμο"
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Τηλέφωνο Επικοινωνίας *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="Κινητό ή Σταθερό"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Περιοχή Έργου *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="π.χ. Καλαμαριά, Θέρμη, Περαία, Κέντρο..."
                        value={quoteForm.area}
                        onChange={(e) => setQuoteForm({ ...quoteForm, area: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                      />
                      <p className="text-[9px] text-gray-500 italic mt-0.5">Tip: Κάντε κλικ σε οποιαδήποτε περιοχή στο footer για αυτόματη εισαγωγή!</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Περιγραφή Έργου *</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Περιγράψτε μας τις εργασίες που θέλετε να κάνετε (π.χ. εκσκαφή θεμελίων, καθαρισμός οικοπέδου 500τμ, διάνοιξη χαντακιού αποχέτευσης κλπ.)"
                        value={quoteForm.description}
                        onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                      ></textarea>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1 pb-2">
                      <input 
                        type="checkbox" 
                        id="quote-privacy"
                        required
                        checked={quotePrivacyAccepted}
                        onChange={(e) => setQuotePrivacyAccepted(e.target.checked)}
                        className="mt-1 accent-[#F27D26] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <label htmlFor="quote-privacy" className="text-xs text-gray-400 select-none cursor-pointer leading-relaxed">
                        Έχω διαβάσει και αποδέχομαι την{" "}
                        <button 
                          type="button" 
                          onClick={() => setIsPrivacyModalOpen(true)}
                          className="text-[#F27D26] underline hover:text-[#ff8e3a] font-semibold"
                        >
                          Πολιτική Απορρήτου & Προστασίας Δεδομένων
                        </button>{" "}
                        της Thess-Skavo. *
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold text-xs uppercase tracking-widest rounded transition-all shadow-md shadow-[#F27D26]/15 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ ΠΡΟΣΦΟΡΑΣ
                    </button>
                  </form>
                )}

                {/* Form Option 2: General message */}
                {formType === 'message' && (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Το Όνομά σας *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="π.χ. Γιώργος Παπαδόπουλος"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Το Email σας *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="email@example.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Θέμα *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Θέμα μηνύματος"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Το Μήνυμά σας (προαιρετικό)</label>
                      <textarea 
                        rows={5}
                        placeholder="Γράψτε εδώ την ερώτησή σας ή τις λεπτομέρειες του μηνύματός σας..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-white/5 rounded p-3 text-sm text-white focus:outline-none focus:border-[#F27D26]"
                      ></textarea>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1 pb-2">
                      <input 
                        type="checkbox" 
                        id="contact-privacy"
                        required
                        checked={contactPrivacyAccepted}
                        onChange={(e) => setContactPrivacyAccepted(e.target.checked)}
                        className="mt-1 accent-[#F27D26] w-4 h-4 cursor-pointer shrink-0"
                      />
                      <label htmlFor="contact-privacy" className="text-xs text-gray-400 select-none cursor-pointer leading-relaxed">
                        Έχω διαβάσει και αποδέχομαι την{" "}
                        <button 
                          type="button" 
                          onClick={() => setIsPrivacyModalOpen(true)}
                          className="text-[#F27D26] underline hover:text-[#ff8e3a] font-semibold"
                        >
                          Πολιτική Απορρήτου & Προστασίας Δεδομένων
                        </button>{" "}
                        της Thess-Skavo. *
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#F27D26] hover:bg-[#ff8e3a] text-black font-extrabold text-xs uppercase tracking-widest rounded transition-all shadow-md shadow-[#F27D26]/15 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      ΑΠΟΣΤΟΛΗ ΜΗΝΥΜΑΤΟΣ
                    </button>
                  </form>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Embedded Location Map Section */}
      <section id="map-section" className="relative h-auto md:h-[400px] border-t border-white/10 bg-[#0F0F0F] overflow-hidden flex flex-col">
        <div className="w-full h-[320px] md:h-full md:absolute md:inset-0 z-0">
          {/* Iframe with Google Maps centered in Ano Peraia, Thessaloniki */}
          <iframe 
            src="https://maps.google.com/maps?q=Skavo-Thess,%20%CE%9A%CE%BF%CE%BB%CE%BF%CE%BA%CE%BF%CF%84%CF%81%CF%8E%CE%BD%CE%B7%20%CE%BA%CE%B1%CE%B9%20%CE%A0%CE%B1%CE%BC%CF%80%CE%BF%CF%85%CE%B4%CE%AC%CE%BA%CE%B7,%20%CE%A0%CE%B5%CF%81%CE%B1%CE%AF%CE%B1,%20%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Skavo-Thess Map Location"
          ></iframe>
        </div>

        {/* Overlay address info card over the map */}
        <div className="relative md:absolute md:top-8 md:left-12 z-10 w-full md:max-w-sm bg-black/95 p-6 border-b md:border md:rounded border-white/10 shadow-2xl backdrop-blur-md">
          <div className="space-y-3">
            <h4 className="text-[#F27D26] text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              ΕΔΡΑ ΕΤΑΙΡΕΙΑΣ
            </h4>
            <p className="text-sm font-extrabold text-white">Άνω Περαία Θεσσαλονίκης</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Οδό Κολοκοτρώνη και Παμπουδάκη,<br />
              (έναντι 1ου γυμνασίου Περαίας),<br />
              Τ.Κ. 57019, Θεσσαλονίκη
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://maps.google.com/?q=Skavo-Thess,+Κολοκοτρώνη+και+Παμπουδάκη,+Περαία,+Θεσσαλονίκη" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] text-[#F27D26] hover:underline uppercase font-bold tracking-wider"
              >
                ΟΔΗΓΙΕΣ ΠΛΟΗΓΗΣΗΣ &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & Regional Service Footer */}
      <footer className="bg-[#050505] border-t border-white/10 overflow-hidden">

        {/* Main Footer Links & Credentials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo variant="compact" color="primary" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Επαγγελματικές χωмаτουργικές εργασίες στη Θεσσαλονίκη με σύγχρονο στόλο και εγγυημένη συνέπεια. Σκάβουμε στην ποιότητα, χτίζουμε στην αξιοπιστία.
            </p>
            <div className="flex gap-4 text-xs font-semibold text-gray-500">
              <span>Α.Φ.Μ. Διαθέσιμο κατόπιν ζήτησης</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Κύριες Υπηρεσίες</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>&bull; Εκσκαφές θεμελίων &amp; οικοδομών</li>
              <li>&bull; Κατεδαφίσεις κτιρίων &amp; εσωτερικές</li>
              <li>&bull; Διαμορφώσεις κήπων &amp; επιπεδώσεις</li>
              <li>&bull; Διάνοιξη αποχετεύσεων &amp; χαντακιών</li>
              <li>&bull; Μεταφορά αδρανών υλικών &amp; μπαζών</li>
              <li>&bull; Τοποθέτηση βόθρων &amp; αντιπλημμυρικά</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Στοιχεία Επικοινωνίας</h4>
            <ul className="text-xs text-gray-400 space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
                <a href="tel:+306949114517" className="hover:text-white font-mono">(+30) 694 911 4517</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
                <a href="mailto:info@skavo-thess.gr" className="hover:text-white">info@skavo-thess.gr</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F27D26] shrink-0 mt-0.5" />
                <span>
                  Οδό Κολοκοτρώνη και Παμπουδάκη,<br />
                  Άνω Περαία, Τ.Κ. 57019, Θεσσαλονίκη
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Ribbon */}
        <div className="bg-black py-6 px-4 sm:px-8 border-t border-white/5 text-center text-xs text-gray-600">
          <div className="max-w-7xl mx-auto text-center space-y-2">
            <p>&copy; 2019-2026 Skavo-Thess. All Rights Reserved.</p>
            <p>
              <button 
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-gray-500 hover:text-[#F27D26] underline transition-colors"
              >
                Πολιτική Απορρήτου & Προστασίας Δεδομένων
              </button>
            </p>
          </div>
        </div>

      </footer>

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#121212] border border-white/10 rounded-lg max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl relative animate-in fade-in zoom-in-95 duration-250">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181818] rounded-t-lg">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#F27D26]" />
                <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wider">
                  Πολιτική Απορρήτου & Προστασίας Δεδομένων
                </h3>
              </div>
              <button 
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition"
                aria-label="Κλείσιμο"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-300 text-xs sm:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
              
              <div className="space-y-2">
                <p className="font-bold text-white text-base">Thess-Skavo</p>
                <p>
                  Η επιχείρηση Thess-Skavo (εφεξής «εμείς» ή «η επιχείρηση») σέβεται την ιδιωτικότητά σας και δεσμεύεται για την προστασία των προσωπικών δεδομένων των χρηστών που επισκέπτονται τον ιστότοπό μας και χρησιμοποιούν τη φόρμα επικοινωνίας μας.
                </p>
                <p>
                  Η παρούσα Πολιτική Απορρήτου εξηγεί ποια δεδομένα συλλέγουμε, πώς τα χρησιμοποιούμε και πώς τα προστατεύουμε σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">1. Ποια Δεδομένα Συλλέγουμε</h4>
                <p>Όταν συμπληρώνετε τη φόρμα επικοινωνίας ή προσφοράς στον ιστότοπό μας, συλλέγουμε μόνο τα απολύτως απαραίτητα στοιχεία για την εξυπηρέτησή σας:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-400">
                  <li>Ονοματεπώνυμο ή Επωνυμία Εταιρείας.</li>
                  <li>Τηλέφωνο Επικοινωνίας.</li>
                  <li>Διεύθυνση Ηλεκτρονικού Ταχυδρομείου (E-mail).</li>
                  <li>Πληροφορίες σχετικά με το έργο (Περιοχή έργου, είδος εργασίας, περιγραφή).</li>
                </ul>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">2. Σκοπός Επεξεργασίας των Δεδομένων</h4>
                <p>Χρησιμοποιούμε τα δεδομένα που μας παρέχετε αποκλειστικά για τους εξής σκοπούς:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-400">
                  <li>Για να επικοινωνήσουμε μαζί σας σχετικά με το αίτημά σας.</li>
                  <li>Για να σας παρέχουμε οικονομική προσφορά για τις χωματουργικές/τεχνικές εργασίες που ζητήσατε.</li>
                  <li>Για την καλύτερη οργάνωση και εκτέλεση του έργου, εφόσον συνεργαστούμε.</li>
                </ul>
                <p className="italic text-gray-400 bg-white/5 p-3 rounded border-l-2 border-[#F27D26]">
                  <strong>Σημείωση:</strong> Δεν χρησιμοποιούμε τα στοιχεία σας για διαφημιστικούς σκοπούς (newsletters) εκτός αν μας δώσετε τη ρητή συγκατάθεσή σας, και ποτέ δεν τα πουλάμε ή τα παραχωρούμε σε τρίτους.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">3. Χρονικό Διάστημα Διατήρησης Δεδομένων</h4>
                <p>
                  Διατηρούμε τα προσωπικά σας δεδομένα μόνο για όσο χρονικό διάστημα απαιτείται για την εκπλήρωση των παραπάνω σκοπών (π.χ. μέχρι να ολοκληρωθεί η επικοινωνία ή το έργο) ή όπως ορίζεται από τη φορολογική και νομική νομοθεσία σε περίπτωση σύναψης συμφωνίας/έκδοσης τιμολογίων.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">4. Ασφάλεια Δεδομένων</h4>
                <p>
                  Λαμβάνουμε όλα τα απαραίτητα τεχνικά και οργανωτικά μέτρα (όπως χρήση πρωτοκόλλου κρυπτογράφησης SSL στον ιστότοπο) για να διασφαλίσουμε ότι τα δεδομένα σας είναι ασφαλή από μη εξουσιοδοτημένη πρόσβαση, απώλεια ή αλλοίωση.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">5. Τα Δικαιώματά σας (Σύμφωνα με το GDPR)</h4>
                <p>Έχετε ανά πάσα στιγμή τα εξής δικαιώματα σχετικά με τα προσωπικά σας δεδομένα:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-400">
                  <li><strong>Δικαίωμα Πρόσβασης &amp; Διόρθωσης:</strong> Μπορείτε να μάθετε ποια στοιχεία σας διατηρούμε και να ζητήσετε τη διόρθωσή τους αν είναι ανακριβή.</li>
                  <li><strong>Δικαίωμα Διαγραφής («Δικαίωμα στη λήθη»):</strong> Μπορείτε να ζητήσετε τη διαγραφή των δεδομένων σας από το αρχείο μας, εφόσον δεν εκκρεμεί νομική ή οικονομική υποχρέωση.</li>
                  <li><strong>Δικαίωμα Περιορισμού/Εναντίωσης:</strong> Μπορείτε να ζητήσετε να σταματήσουμε την επεξεργασία των στοιχείων σας.</li>
                </ul>
                <p>
                  Για να ασκήσετε οποιοδήποτε από τα δικαιώματά σας, μπορείτε να επικοινωνήσετε μαζί μας στο e-mail: <a href="mailto:info@skavo-thess.gr" className="text-[#F27D26] hover:underline font-mono">info@skavo-thess.gr</a>.
                </p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <h4 className="font-extrabold text-white uppercase text-xs tracking-wider text-[#F27D26]">6. Αλλαγές στην Πολιτική Απορρήτου</h4>
                <p>
                  Διατηρούμε το δικαίωμα να ανανεώνουμε την παρούσα Πολιτική Απορρήτου όταν αυτό είναι απαραίτητο (π.χ. λόγω αλλαγών στη νομοθεσία). Σας προτείνουμε να διαβάζετε ανά διαστήματα αυτή τη σελίδα.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-white/5 bg-[#181818] flex justify-end rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-5 py-2.5 bg-[#F27D26] hover:bg-[#ff8e3a] text-black text-xs font-black uppercase tracking-wider rounded transition"
              >
                ΚΛΕΙΣΙΜΟ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Sticky Call Button (Mobile & Desktop Speed Dial) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3.5">
        
        {/* Helper balloon for first time visitor */}
        <div className="hidden sm:block bg-black/95 border border-white/10 px-4 py-2 rounded-lg shadow-2xl text-xs max-w-xs backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-2 text-[#F27D26] font-extrabold uppercase tracking-wider text-[10px] mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span>Άμεση Τεχνική Εκτίμηση</span>
          </div>
          <p className="text-gray-300">Καλέστε μας τώρα στο <span className="text-[#F27D26] font-bold font-mono">694 911 4517</span></p>
        </div>

        {/* Sticky Circle green phone button */}
        <a 
          href="tel:+306949114517"
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:bg-green-400 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
          title="Καλέστε μας τώρα"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></span>
          <Phone className="w-7 h-7 text-white fill-current group-hover:rotate-12 transition-transform" />
        </a>

      </div>

    </div>
  );
}

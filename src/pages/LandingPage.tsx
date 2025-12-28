import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  Ruler, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Box,
  Smartphone,
  Lock,
  Clock,
  ShieldPlus,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI Body Scanning',
      description: 'Get accurate measurements using just your phone camera and a reference object for real-world scaling.',
    },
    {
      icon: Lock,
      title: 'Privacy & Safety',
      description: 'Ensures total safety for girls by eliminating the need for public trial rooms and the risks of hidden cameras.',
    },
    {
      icon: ShieldPlus,
      title: 'Hygienic Fitting',
      description: 'Avoid skin diseases and infections often transmitted through shared clothing in unsanitized dressing rooms.',
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Saves time by eliminating travel, trial room queues, and the frustration of trial-and-error shopping.',
    },
    {
      icon: Ruler,
      title: 'Size Prediction',
      description: 'Know your exact size across all major brands, reducing manual measurement errors significantly.',
    },
    {
      icon: Box,
      title: 'Lower Return Rates',
      description: 'Reduces product returns, a major e-commerce problem, by ensuring the first purchase is the right fit.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Users' },
    { value: '98%', label: 'Accuracy Rate' },
    { value: 'Zero', label: 'Health Risks' },
    { value: '100%', label: 'Privacy' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">AI Digital Shopping</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/signin" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with New Video */}
      <section className="relative py-12 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Next-Gen Virtual Try-On
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-foreground">
                The Future of <br />
                <span className="text-primary">Contactless Fitting</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Experience seamless AI-powered shopping. Scan your body, try on clothes virtually, and order with confidence—all while protecting your health and privacy.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  Try Virtual Scan
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Platform Demo Video Container */}
            <div className="flex-1 w-full max-w-2xl">
              <div className="relative rounded-3xl overflow-hidden border-8 border-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-black aspect-video">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/edit_vedio_like_after_selecti.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                   <span className="text-white text-sm font-bold tracking-widest uppercase">Live AI Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-card rounded-3xl border border-border p-8 hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Safety Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Prioritizing Your Wellbeing</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
               <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20">
                  <ShieldCheck className="w-10 h-10 mb-4 opacity-80" />
                  <h4 className="text-2xl font-bold mb-4 text-white">Safe for Girls</h4>
                  <p className="opacity-90 leading-relaxed">
                    AI Digital Shopping provides a fully private fitting environment. Eliminate the anxiety of public dressing rooms and ensure your safety through home-based virtual try-ons.
                  </p>
               </div>
               <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20">
                  <ShieldPlus className="w-10 h-10 mb-4 opacity-80" />
                  <h4 className="text-2xl font-bold mb-4 text-white">Hygienic Innovation</h4>
                  <p className="opacity-90 leading-relaxed">
                    Avoid shared garments and the risk of skin disease transmission. Our AI-driven analysis offers a 100% contact-free solution for your fashion needs.
                  </p>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">AI Digital Shopping</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Digital Shopping. Smart. Safe. Efficient.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
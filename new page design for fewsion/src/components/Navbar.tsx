import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#070707]/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[11px] flex items-center justify-center overflow-hidden">
                {/* SVG 3D Knot Symbol */}
                <svg className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.8-.9 6.5-2.4L20.5 18" />
                  <path d="M22 12c0 5.5-4.5 10-10 10-2.5 0-4.8-.9-6.5-2.4L3.5 18" />
                  <circle cx="12" cy="12" r="3" fill="url(#goldGrad)" />
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="24" y2="24">
                      <stop stopColor="#FCD34D" />
                      <stop offset="1" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Few<span className="gold-gradient-text">sion</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/80 font-semibold -mt-1">AI Marketplace</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('aimatch')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              AI Match Studio
            </button>
            <button onClick={() => onNavigate('brief-builder')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              Brief Lab
            </button>
            <button onClick={() => onNavigate('creators')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              Creators & Editors
            </button>
            <button onClick={() => onNavigate('features')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              Features
            </button>
            <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              Pricing
            </button>
            <button onClick={() => onNavigate('faq')} className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors">
              FAQ
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onOpenAuth('signin')}
              className="text-sm font-semibold text-zinc-300 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenAuth('signup')}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-xl group-hover:opacity-90 transition-opacity"></span>
              <span className="relative block px-5 py-2.5 bg-[#0a0a0c] rounded-[11px] text-amber-300 group-hover:bg-opacity-80 transition-all flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-amber-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#09090b]/98 backdrop-blur-2xl border-b border-amber-500/20 p-6 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => { onNavigate('aimatch'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              AI Match Studio
            </button>
            <button 
              onClick={() => { onNavigate('creators'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              Creators & Editors
            </button>
            <button 
              onClick={() => { onNavigate('brief-builder'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              Brief Lab
            </button>
            <button 
              onClick={() => { onNavigate('features'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              Features
            </button>
            <button 
              onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              Pricing
            </button>
            <button 
              onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }}
              className="text-left text-base font-medium text-zinc-300 hover:text-amber-400 py-2 border-b border-zinc-800"
            >
              FAQ
            </button>
            
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold text-center"
              >
                Sign In
              </button>
              <button 
                onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-center shadow-lg shadow-amber-500/20"
              >
                Get Started Free
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Globe, Share2, MessageSquare, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-[#050505] border-t border-amber-500/20 pt-20 pb-12 relative overflow-hidden text-zinc-400 text-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 pb-16 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[11px] flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.8-.9 6.5-2.4L20.5 18" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Few<span className="gold-gradient-text">sion</span>
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Helping brands, elite creators, and pro video editors collaborate through neural AI matching and secure escrow smart contracts.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#social" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/45 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#social" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/45 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#social" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/45 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#social" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/45 transition-colors">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Platform</h4>
            <button onClick={() => onNavigate('aimatch')} className="text-left hover:text-amber-400 transition-colors">AI Match Studio</button>
            <button onClick={() => onNavigate('brief-builder')} className="text-left hover:text-amber-400 transition-colors">AI Brief Lab</button>
            <button onClick={() => onNavigate('creators')} className="text-left hover:text-amber-400 transition-colors">Creators & Editors</button>
            <button onClick={() => onNavigate('features')} className="text-left hover:text-amber-400 transition-colors">Key Features</button>
            <button onClick={() => onNavigate('pricing')} className="text-left hover:text-amber-400 transition-colors">Pricing Plans</button>
            <button onClick={() => onNavigate('faq')} className="text-left hover:text-amber-400 transition-colors">FAQ & Support</button>
          </div>

          {/* Talent Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Top Categories</h4>
            <span className="hover:text-amber-400 cursor-pointer" onClick={() => onNavigate('creators')}>Video Editors</span>
            <span className="hover:text-amber-400 cursor-pointer" onClick={() => onNavigate('creators')}>AI Artists</span>
            <span className="hover:text-amber-400 cursor-pointer" onClick={() => onNavigate('creators')}>Tech Reviewers</span>
            <span className="hover:text-amber-400 cursor-pointer" onClick={() => onNavigate('creators')}>Lifestyle & UGC</span>
            <span className="hover:text-amber-400 cursor-pointer" onClick={() => onNavigate('creators')}>Esports & Gaming</span>
          </div>

          {/* Legal / Account */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Account</h4>
            <button onClick={() => onOpenAuth('signin')} className="text-left hover:text-amber-400 transition-colors">Sign In</button>
            <button onClick={() => onOpenAuth('signup')} className="text-left hover:text-amber-400 transition-colors">Get Started Free</button>
            <span className="hover:text-amber-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-400 cursor-pointer">Security & Escrow</span>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All AI Systems Operational 99.98%</span>
          </div>
          <div>
            © {new Date().getFullYear()} Fewsion Inc. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

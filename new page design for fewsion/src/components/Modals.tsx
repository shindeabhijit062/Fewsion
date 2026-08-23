import React, { useEffect, useState } from 'react';
import { X, Sparkles, Star, CheckCircle2, ShieldCheck, Send, Check } from 'lucide-react';
import { Creator } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [role, setRole] = useState<'brand' | 'creator'>('brand');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-amber-500/30 relative shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-white">Success!</h3>
            <p className="text-xs text-zinc-400">Welcome to Fewsion AI. Redirecting to your workspace...</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back to Fewsion' : 'Create Fewsion Account'}
              </h3>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2 mb-6 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${role === 'brand' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  I'm a Brand / Agency
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${role === 'creator' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  Creator / Editor
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-400 mb-1.5">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all mt-2"
              >
                {mode === 'signin' ? 'Sign In' : 'Get Started Free'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-400">
              {mode === 'signin' ? (
                <span>Don't have an account? <button onClick={() => setMode('signup')} className="text-amber-400 font-bold hover:underline">Sign up</button></span>
              ) : (
                <span>Already have an account? <button onClick={() => setMode('signin')} className="text-amber-400 font-bold hover:underline">Sign in</button></span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

interface CreatorModalProps {
  creator: Creator | null;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
  const [briefSent, setBriefSent] = useState(false);
  const [campaignBudget, setCampaignBudget] = useState('2,000');
  const [message, setMessage] = useState('');

  if (!creator) return null;

  const handleSendBrief = (e: React.FormEvent) => {
    e.preventDefault();
    setBriefSent(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setBriefSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="glass-card rounded-3xl max-w-2xl w-full border border-amber-500/30 relative shadow-2xl my-8 overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/70 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover Image Header */}
        <div className="relative h-52">
          <img src={creator.coverImage} alt={creator.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/40 to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            <img src={creator.avatar} alt={creator.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-2xl" />
            <div className="flex flex-col">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md font-bold w-fit mb-1 border border-amber-500/30">
                {creator.matchScore}% AI Match
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1.5">
                {creator.name}
                <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </h2>
              <p className="text-xs text-amber-300/80 font-medium">{creator.role}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          
          {briefSent ? (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold text-white">Collaboration Brief Sent!</h3>
              <p className="text-xs text-zinc-400">{creator.name} has received your brief and will respond within 4 hours.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Bio & Rating */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="flex-1">
                  <h4 className="text-xs uppercase font-bold text-zinc-400 mb-2">About Creator</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{creator.bio}</p>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-amber-300">{creator.rating}</span>
                    <span className="text-xs text-zinc-400">({creator.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-xs font-bold text-white">Starting at {creator.startingPrice}</span>
                </div>
              </div>

              {/* Recent Portfolio Work Samples */}
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-400 mb-3">Recent Verified Portfolio Work</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creator.recentWork.map((work, idx) => (
                    <div key={idx} className="bg-black/60 rounded-2xl overflow-hidden border border-zinc-800 flex gap-3 p-2.5 items-center">
                      <img src={work.thumbnail} alt={work.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white line-clamp-1">{work.title}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">{work.views} Views • High Retention</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration Brief Form */}
              <form onSubmit={handleSendBrief} className="pt-4 border-t border-zinc-800 space-y-4">
                <h4 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Send Secure Collaboration Brief
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">Proposed Budget ($ USD)</label>
                    <input 
                      type="text"
                      value={campaignBudget}
                      onChange={(e) => setCampaignBudget(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">Deliverable Type</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
                      <option>YouTube Long-Form Cinematic Edit</option>
                      <option>TikTok / Reels Viral UGC Package</option>
                      <option>AI Commercial Video Campaign</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">Project Brief & Details</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe your brand goals, deliverables, and timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Collaboration Request & Escrow Lock</span>
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

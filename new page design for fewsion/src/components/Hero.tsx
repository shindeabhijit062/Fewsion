import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, TrendingUp, Lock, Star, Sparkles, Check, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onAiMatchClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAiMatchClick }) => {
  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden flex items-center bg-[#050505]">
      {/* Background ambient lighting and golden particle waves */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="magic-noise absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"></div>
      <div className="perspective-grid absolute -bottom-24 left-1/2 h-[420px] w-[1200px] -translate-x-1/2 opacity-45 pointer-events-none"></div>
      <div className="energy-beam absolute left-0 top-[42%] h-24 w-full opacity-60 pointer-events-none"></div>

      {/* Subtle background wave lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 700C300 750 600 450 900 650C1200 850 1400 500 1600 600" stroke="url(#goldWave)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-100 750C350 800 650 500 950 700C1250 900 1350 550 1600 650" stroke="url(#goldWave2)" strokeWidth="1" strokeLinecap="round" />
          <defs>
            <linearGradient id="goldWave" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FBBF24" stopOpacity="0.8" />
              <stop offset="1" stopColor="#D97706" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldWave2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D97706" stopOpacity="0" />
              <stop offset="0.6" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="1" stopColor="#B45309" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & 4 Feature Badges */}
          <motion.div
            initial={{ opacity: 0, x: -46, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 w-fit shadow-lg shadow-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen AI Creator Ecosystem</span>
            </div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6"
            >
              AI-<span className="text-white">Powered</span> <br />
              Creator <span className="gold-gradient-text">Marketplace</span>
            </motion.h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-lg sm:text-xl font-normal leading-relaxed mb-10 max-w-xl">
              Helping Brands, Creators & Editors Collaborate Through <span className="text-amber-300 font-semibold">AI</span>
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.55 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <button 
                onClick={onAiMatchClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-sm hover:opacity-95 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 group"
              >
                <span>Run AI Match</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button 
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-semibold text-sm hover:bg-zinc-800 transition-all shadow-lg"
              >
                Explore Talent
              </button>
            </motion.div>

            {/* 4 Feature Badges at Bottom of Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80">
              
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">AI Matching</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Verified Creators</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Performance Portfolio</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Secure Payments</span>
              </div>

            </div>

          </motion.div>

          {/* Center Column: 3D Golden Knot Sculpture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.22, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 flex justify-center items-center relative py-10 lg:py-0"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center animate-float">
              
              {/* Outer Golden Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse-glow"></div>
              
              {/* 3D Knot SVG / Illustration */}
              <div className="absolute inset-6 rounded-full border border-amber-300/15"></div>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-yellow-200 shadow-[0_0_26px_rgba(251,191,36,1)] orbital-dot" style={{ '--orbit-radius': '154px', '--orbit-speed': '7s' } as React.CSSProperties}></div>
              <div className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_22px_rgba(249,115,22,1)] orbital-dot" style={{ '--orbit-radius': '118px', '--orbit-speed': '10s' } as React.CSSProperties}></div>
              <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-neon-breathe">
                <svg className="w-full h-full text-amber-400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path initial={{ pathLength: 0, opacity: 0.2 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} d="M260 80C320 80 370 130 370 190C370 250 320 300 260 300C200 300 170 240 140 210C110 180 80 150 50 150C20 150 0 170 0 200C0 230 20 250 50 250C80 250 110 220 140 190C170 160 200 100 260 100" stroke="url(#knot3d)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
                  <motion.path initial={{ pathLength: 0, opacity: 0.2 }} animate={{ pathLength: 1, opacity: 0.85 }} transition={{ duration: 1.6, delay: 0.22, ease: 'easeInOut' }} d="M140 320C80 320 30 270 30 210C30 150 80 100 140 100C200 100 230 160 260 190C290 220 320 250 350 250C380 250 400 230 400 200C400 170 380 150 350 150C320 150 290 180 260 210C230 240 200 300 140 300" stroke="url(#knot3d2)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                  <path className="wave-tracer" d="M260 80C320 80 370 130 370 190C370 250 320 300 260 300C200 300 170 240 140 210C110 180 80 150 50 150C20 150 0 170 0 200C0 230 20 250 50 250C80 250 110 220 140 190C170 160 200 100 260 100" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
                  <defs>
                    <linearGradient id="knot3d" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFBEB" />
                      <stop offset="0.3" stopColor="#F59E0B" />
                      <stop offset="0.7" stopColor="#D97706" />
                      <stop offset="1" stopColor="#78350F" />
                    </linearGradient>
                    <linearGradient id="knot3d2" x1="400" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEE2E2" />
                      <stop offset="0.4" stopColor="#F59E0B" />
                      <stop offset="0.8" stopColor="#B45309" />
                      <stop offset="1" stopColor="#451A03" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Glowing Particle Sparkles around Knot */}
              <div className="absolute top-4 right-10 w-2 h-2 rounded-full bg-amber-300 animate-ping"></div>
              <div className="absolute bottom-10 left-6 w-3 h-3 rounded-full bg-orange-400 animate-pulse"></div>
              <div className="absolute top-1/2 left-2 w-1.5 h-1.5 rounded-full bg-yellow-200"></div>

            </div>
          </motion.div>

          {/* Right Column: 3 Floating UI Cards (Matching Reference) */}
          <motion.div
            initial={{ opacity: 0, x: 54, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.34, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            
            {/* Card 1: AI Match Card */}
            <motion.div whileHover={{ y: -6, rotateX: 3, rotateY: -4 }} className="glass-card rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="live-card-scan absolute inset-0 opacity-40"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Match</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">98% Match</span>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Brand" className="w-8 h-8 rounded-full object-cover border border-amber-400/50" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Brand</span>
                    <span className="text-[10px] text-zinc-400">Nexus AI</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  <div className="w-8 h-[1px] bg-amber-400/60 dashed"></div>
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-md shadow-amber-500/50">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="w-8 h-[1px] bg-amber-400/60"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-white">Creator</span>
                    <span className="text-[10px] text-zinc-400">Arjun M.</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Creator" className="w-8 h-8 rounded-full object-cover border border-amber-400/50" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Match Score</span>
                  <span className="text-amber-400 font-bold">98%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden p-[1px]">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full w-[98%] shadow-sm shadow-amber-500/50"></div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Top Creator Card */}
            <motion.div whileHover={{ y: -6, rotateX: -2, rotateY: 4 }} className="glass-card rounded-2xl p-4 shadow-xl flex items-center justify-between group hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop" alt="Arjun Mehta" className="w-12 h-12 rounded-xl object-cover border border-amber-500/30" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px]">⭐</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    Top Creator 
                  </span>
                  <span className="text-sm font-bold text-white">Arjun Mehta</span>
                  <span className="text-xs text-zinc-400">Video Editor</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-amber-300">4.9</span>
              </div>
            </motion.div>

            {/* Card 3: Campaign Performance Card */}
            <motion.div whileHover={{ y: -6, rotateX: 2, rotateY: -3 }} className="glass-card rounded-2xl p-4 shadow-xl group hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-300">Campaign Performance</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">+42% vs Avg</span>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="h-12 w-full mb-3 flex items-end">
                <svg className="w-full h-full text-amber-400 overflow-visible" viewBox="0 0 200 40" fill="none">
                  <path d="M0 35 L20 28 L40 30 L60 18 L80 22 L100 12 L120 15 L140 8 L160 14 L180 5 L200 2" stroke="url(#chartGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#F59E0B" />
                      <stop offset="1" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
                <div>
                  <div className="text-xs font-extrabold text-white">1.2M+</div>
                  <div className="text-[10px] text-zinc-400">Reach</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">230K+</div>
                  <div className="text-[10px] text-zinc-400">Engagement</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-400">18.4%</div>
                  <div className="text-[10px] text-zinc-400">Conversion</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

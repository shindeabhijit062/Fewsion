import React from 'react';
import { Sparkles, Shield, Cpu, BarChart3, Lock, Users, Zap } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: "Neural AI Brand-Creator Matching",
      description: "Our proprietary AI analyses 50+ data points including brand tone, audience demographic overlap, and past portfolio success with 99% accuracy."
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: "Verified Portfolio & Identity Proof",
      description: "Eliminate fake metrics and ghosting. Every creator and video editor undergoes automated API analytics and manual identity verification."
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      title: "Smart Escrow & Milestone Payouts",
      description: "Secure smart contract escrow protects both brands and creators. Funds release automatically upon verified milestone deliverables."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: "Real-Time Campaign Analytics",
      description: "Track live ROAS, view velocity, click-through rates, and audience sentiment across YouTube, TikTok, and Instagram in one unified dashboard."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "AI Brief Generator & Contracts",
      description: "Instantly generate legally binding collaboration agreements, custom video briefs, and usage rights with Fewsion AI Assistant."
    },
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: "Multi-Brand Agency Workspaces",
      description: "Manage multiple brand campaigns, assign team roles, and coordinate editors and creators with enterprise-grade collaboration tools."
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#070707] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Engineered for <span className="gold-gradient-text">High-Velocity</span> Growth
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Everything top-tier brands, elite creators, and pro video editors need to collaborate seamlessly through AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-amber-400/80">
                <span>Explore Feature</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

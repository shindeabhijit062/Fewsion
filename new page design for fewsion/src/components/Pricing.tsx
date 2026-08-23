import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingProps {
  onGetStarted: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onGetStarted }) => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Creator / Editor",
      priceMonthly: 0,
      priceAnnual: 0,
      description: "For independent video editors and creators looking for elite brand collaborations.",
      badge: "Free Forever",
      features: [
        "AI Portfolio Verification",
        "Direct Brand Direct Messaging",
        "Secure Escrow Payouts",
        "Basic AI Matching (3 per week)",
        "Standard Community Support"
      ],
      popular: false
    },
    {
      name: "Brand Growth",
      priceMonthly: 199,
      priceAnnual: 159,
      description: "For scaling DTC, SaaS, and tech brands running regular creator campaigns.",
      badge: "Most Popular",
      features: [
        "Unlimited Neural AI Matching",
        "Verified Creator Directory Access",
        "Automated AI Brief & Contract Generator",
        "Real-Time Campaign Analytics Dashboard",
        "Dedicated Talent Success Manager",
        "Zero Platform Commission"
      ],
      popular: true
    },
    {
      name: "Enterprise Agency",
      priceMonthly: 599,
      priceAnnual: 479,
      description: "For agencies and large enterprises managing multi-brand creator rosters.",
      badge: "Custom AI Roster",
      features: [
        "Multi-Brand Workspace Management",
        "Custom Fine-Tuned AI Matching Models",
        "Priority 24/7 Concierge Support",
        "Advanced Legal & Tax Compliance",
        "Custom API Integrations & Webhooks",
        "Dedicated Account Director"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple Plans for <span className="gold-gradient-text">Every Scale</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-8">
            Choose the plan that fits your collaboration goals. Switch or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                !annual ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annual ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded-md font-extrabold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div 
                key={idx}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                  plan.popular 
                    ? 'border-2 border-amber-500 shadow-2xl shadow-amber-500/20 bg-gradient-to-b from-[#16120e] to-[#0d0b09]' 
                    : 'border border-amber-500/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-extrabold shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/20 font-semibold">
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-xs mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-zinc-800">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-zinc-400">/ month {annual && price > 0 ? 'billed annually' : ''}</span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onGetStarted(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black hover:opacity-95 shadow-amber-500/25'
                      : 'bg-zinc-900 border border-amber-500/30 text-amber-300 hover:bg-zinc-800'
                  }`}
                >
                  Get Started with {plan.name}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

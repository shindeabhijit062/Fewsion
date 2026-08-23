import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: "$64M+", label: "Creator Payouts Facilitated" },
    { value: "99.4%", label: "AI Match Success Rate" },
    { value: "14,200+", label: "Verified Brands & Editors" },
    { value: "3.4x", label: "Average Campaign ROI Increase" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#070707] to-[#0a0908] border-y border-amber-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gold-gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-[#070707] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Loved by Elite Brands & <span className="gold-gradient-text">Creators</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            See how Fewsion is transforming how the world's leading companies and video editors collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                    {t.metric}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-amber-500/20 mb-3" />

                <p className="text-zinc-300 text-sm leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-xl object-cover border border-amber-500/40" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{t.author}</span>
                  <span className="text-xs text-zinc-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

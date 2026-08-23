import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight, Zap, Target, DollarSign, Layers, Download, Bot } from 'lucide-react';
import { CREATORS, Creator } from '../data/mockData';

interface AiMatchDemoProps {
  onSelectCreator: (creator: Creator) => void;
}

export const AiMatchDemo: React.FC<AiMatchDemoProps> = ({ onSelectCreator }) => {
  const [selectedNiche, setSelectedNiche] = useState<string>('Video Editors');
  const [campaignGoal, setCampaignGoal] = useState<string>('Retention');
  const [budgetRange, setBudgetRange] = useState<number>(2000);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchedResults, setMatchedResults] = useState<Creator[]>(CREATORS.slice(0, 3));

  const leadMatch = matchedResults[0];
  const goalBoost = useMemo(() => ({
    Retention: 94,
    Conversions: 91,
    Awareness: 96,
    Launch: 93,
  }[campaignGoal] ?? 92), [campaignGoal]);

  const handleRunMatch = (niche: string) => {
    setSelectedNiche(niche);
    setIsMatching(true);
    setTimeout(() => {
      const filtered = CREATORS.filter(c => niche === 'All' || c.category === niche);
      const results = filtered.length > 0 ? filtered : CREATORS.slice(0, 3);
      setMatchedResults([...results].sort((a, b) => (b.matchScore + budgetRange / 5000) - (a.matchScore + budgetRange / 5000)));
      setIsMatching(false);
    }, 950);
  };

  const handleExport = () => {
    const data = JSON.stringify({ selectedNiche, campaignGoal, budgetRange, matchedResults }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fewsion-${selectedNiche.toLowerCase().replace(/\s+/g, '-')}-shortlist.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="aimatch" className="py-24 bg-[#070707] relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Neural AI Matching Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Test Fewsion AI Match in <span className="gold-gradient-text">Real-Time</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Select your project niche and budget to instantly experience our 99% accuracy creator recommendation engine.
          </p>
        </div>

        {/* Interactive Match Console */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-2xl max-w-6xl mx-auto mb-12 relative overflow-hidden">
          <div className="absolute inset-0 neural-grid opacity-20"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-zinc-800">
            
            {/* Step 1: Select Niche */}
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>1. Select Talent Category</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Video Editors', 'AI Artists', 'Tech Reviewers', 'Lifestyle & UGC', 'Gaming'].map((niche) => (
                  <button
                    key={niche}
                    onClick={() => handleRunMatch(niche)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedNiche === niche
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                        : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:border-amber-500/40'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Campaign Goal */}
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>2. Campaign Goal</span>
              </label>
              <select
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/90 px-3.5 py-3 text-xs font-bold text-white outline-none transition focus:border-amber-500"
              >
                {['Retention', 'Conversions', 'Awareness', 'Launch'].map((goal) => (
                  <option key={goal}>{goal}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500">AI reranks talent by portfolio evidence for this outcome.</span>
            </div>

            {/* Step 3: Budget Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>3. Campaign Budget</span>
                </label>
                <span className="text-sm font-extrabold text-white bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                  ${budgetRange.toLocaleString()} USD
                </span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="5000" 
                step="250"
                value={budgetRange}
                onChange={(e) => setBudgetRange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                <span>$500 (Micro)</span>
                <span>$2,500 (Pro)</span>
                <span>$5,000+ (Enterprise)</span>
              </div>
            </div>

            {/* Step 4: Action */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() => handleRunMatch(selectedNiche)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-sm hover:opacity-95 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Neural Match</span>
              </button>
            </div>

          </div>

          {/* Results Area */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Top AI Matches Found ({matchedResults.length})</span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {goalBoost}.4% Compatibility Index
                </span>
                <button onClick={handleExport} className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition">
                  <Download className="w-3.5 h-3.5" /> Export Shortlist
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
            {isMatching ? (
              <motion.div
                key="matching"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-16 flex flex-col items-center justify-center gap-5"
              >
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full border border-amber-400/25"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                  <Sparkles className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-amber-300" />
                </div>
                <p className="text-sm font-semibold text-amber-400 animate-pulse">Analyzing tone, past portfolio metrics & audience overlap...</p>
                <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-3">
                  {['Audience graph', 'Portfolio proof', 'Escrow risk'].map((label, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.12 }}
                      className="rounded-2xl border border-amber-500/20 bg-black/45 p-3"
                    >
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <motion.div className="h-full rounded-full bg-amber-500" initial={{ width: 0 }} animate={{ width: `${85 + index * 5}%` }} transition={{ duration: 0.8, delay: index * 0.14 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchedResults.map((creator) => (
                  <motion.div 
                    key={creator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -7, scale: 1.015 }}
                    className="bg-black/60 rounded-2xl p-5 border border-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => onSelectCreator(creator)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-xl object-cover border border-amber-500/40" />
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{creator.name}</h4>
                            <p className="text-xs text-zinc-400 truncate max-w-[140px]">{creator.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                            {creator.matchScore}%
                          </span>
                          <span className="text-[10px] text-zinc-500">Match</span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 line-clamp-2 mb-4">
                        {creator.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {creator.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/85 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{creator.startingPrice}</span>
                      <button className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            </AnimatePresence>

            {leadMatch && !isMatching && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-amber-500/20 bg-black/50 p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">AI Recommendation</div>
                    <div className="text-sm font-bold text-white">Start with {leadMatch.name} for a {campaignGoal.toLowerCase()} focused campaign.</div>
                  </div>
                  <button onClick={() => onSelectCreator(leadMatch)} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-black transition hover:scale-105">
                    Launch Collaboration
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Audience overlap', goalBoost],
                    ['Delivery reliability', Math.min(99, leadMatch.matchScore + 1)],
                    ['Budget efficiency', Math.max(82, Math.round(100 - budgetRange / 130))],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500"><span>{label}</span><span className="text-amber-300">{value}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

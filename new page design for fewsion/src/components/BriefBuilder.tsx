import { type ReactNode, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, BrainCircuit, Check, ClipboardList, Coins, Rocket, Sparkles, Wand2 } from 'lucide-react';
import { CREATORS, Creator } from '../data/mockData';

interface BriefBuilderProps {
  onSelectCreator: (creator: Creator) => void;
}

const goals = ['Launch a product', 'Drive conversions', 'Build brand awareness', 'Create viral UGC'];
const tones = ['Cinematic', 'Founder-led', 'Viral & punchy', 'Premium editorial'];
const formats = ['YouTube hero video', 'TikTok/Reels pack', 'AI commercial', 'Creator review'];

export const BriefBuilder = ({ onSelectCreator }: BriefBuilderProps) => {
  const [goal, setGoal] = useState(goals[0]);
  const [tone, setTone] = useState(tones[0]);
  const [format, setFormat] = useState(formats[0]);
  const [timeline, setTimeline] = useState(14);
  const [budget, setBudget] = useState(3500);
  const [brief, setBrief] = useState('');
  const [shortlist, setShortlist] = useState<string[]>(['1']);

  const recommendedCreators = useMemo(() => {
    const categoryMap: Record<string, string[]> = {
      'YouTube hero video': ['Video Editors', 'Tech Reviewers'],
      'TikTok/Reels pack': ['Lifestyle & UGC', 'Video Editors'],
      'AI commercial': ['AI Artists', 'Video Editors'],
      'Creator review': ['Tech Reviewers', 'Lifestyle & UGC'],
    };

    const preferred = categoryMap[format] ?? [];
    return CREATORS
      .filter((creator) => preferred.includes(creator.category) || creator.matchScore > 94)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [format]);

  const confidence = useMemo(() => {
    const timelineBoost = timeline <= 10 ? -3 : timeline >= 21 ? 2 : 0;
    const budgetBoost = budget > 4000 ? 2 : budget < 1500 ? -4 : 0;
    return Math.max(84, Math.min(99, 94 + timelineBoost + budgetBoost + shortlist.length));
  }, [budget, shortlist.length, timeline]);

  const generateBrief = () => {
    const primaryCreator = recommendedCreators[0];
    setBrief(
      `Campaign: ${goal}. Format: ${format}. Tone: ${tone}. Recommended lead talent: ${primaryCreator.name}. Budget window: $${budget.toLocaleString()} with ${timeline}-day delivery. Fewsion AI predicts ${confidence}% collaboration fit, strong retention hooks, and secure escrow split into 3 milestones: creative direction, first cut, final performance asset.`
    );
    confetti({ particleCount: 140, spread: 92, origin: { y: 0.68 }, colors: ['#f59e0b', '#fbbf24', '#fff7ed', '#ea580c'] });
  };

  const toggleShortlist = (id: string) => {
    setShortlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section id="brief-builder" className="relative overflow-hidden bg-[#050505] py-24">
      <div className="absolute inset-0 neural-grid opacity-60" />
      <div className="absolute left-1/2 top-24 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
            <BrainCircuit className="h-3.5 w-3.5" />
            Functional AI Brief Lab
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Build a campaign brief, then let <span className="gold-gradient-text">Fewsion</span> shortlist talent.
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            This is a working mini workflow: choose campaign inputs, generate an AI brief, save creators to a shortlist, and open collaboration profiles instantly.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Campaign Goal" icon={<Rocket className="h-4 w-4" />} value={goal} setValue={setGoal} options={goals} />
              <Field label="Creative Format" icon={<ClipboardList className="h-4 w-4" />} value={format} setValue={setFormat} options={formats} />
              <Field label="Brand Tone" icon={<Wand2 className="h-4 w-4" />} value={tone} setValue={setTone} options={tones} />

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <Coins className="h-4 w-4" /> Budget
                </label>
                <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">${budget.toLocaleString()}</span>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/25">AI optimized</span>
                  </div>
                  <input
                    type="range"
                    min="750"
                    max="10000"
                    step="250"
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Delivery Timeline</label>
                <span className="font-bold text-white">{timeline} days</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={timeline}
                onChange={(event) => setTimeline(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-amber-500"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['Fit Score', `${confidence}%`],
                ['Shortlist', `${shortlist.length} saved`],
                ['Projected ROAS', `${(2.8 + budget / 10000).toFixed(1)}x`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.06] p-4">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</div>
                  <motion.div key={value} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-xl font-black text-white">
                    {value}
                  </motion.div>
                </div>
              ))}
            </div>

            <button
              onClick={generateBrief}
              className="holographic-btn mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-black shadow-xl shadow-amber-500/20"
            >
              <Sparkles className="h-4 w-4" /> Generate AI Brief and Shortlist
            </button>

            <AnimatePresence>
              {brief && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 16 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden rounded-2xl border border-amber-400/25 bg-black/70 p-5 text-sm leading-relaxed text-zinc-200"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    <Check className="h-4 w-4" /> Generated Campaign Brief
                  </div>
                  {brief}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-4">
            {recommendedCreators.map((creator, index) => {
              const saved = shortlist.includes(creator.id);
              return (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="glass-card relative overflow-hidden rounded-3xl p-5"
                >
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl" />
                  <div className="relative flex gap-4">
                    <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-amber-400/35" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <h3 className="truncate font-extrabold text-white">{creator.name}</h3>
                        <span className="rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-black text-black">{creator.matchScore}%</span>
                      </div>
                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-zinc-400">{creator.bio}</p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {creator.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-300">{tag}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleShortlist(creator.id)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition ${saved ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-amber-300 ring-1 ring-amber-500/25 hover:ring-amber-400/60'}`}
                        >
                          {saved ? 'Saved to Shortlist' : 'Add to Shortlist'}
                        </button>
                        <button
                          onClick={() => onSelectCreator(creator)}
                          className="flex items-center gap-1 rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 ring-1 ring-amber-500/25 transition hover:bg-amber-500 hover:text-black"
                        >
                          Open Profile <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

interface FieldProps {
  label: string;
  icon: ReactNode;
  value: string;
  options: string[];
  setValue: (value: string) => void;
}

const Field = ({ label, icon, value, options, setValue }: FieldProps) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
      {icon} {label}
    </label>
    <select
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="w-full rounded-2xl border border-zinc-800 bg-black/50 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-amber-500"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
);
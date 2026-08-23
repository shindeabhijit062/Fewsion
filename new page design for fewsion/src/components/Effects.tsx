import { type CSSProperties, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Activity, Radio, Sparkles, Zap } from 'lucide-react';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-1 w-full origin-left bg-gradient-to-r from-amber-300 via-orange-500 to-yellow-200 shadow-[0_0_30px_rgba(245,158,11,0.9)]"
      style={{ scaleX }}
    />
  );
};

export const CursorAura = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleDown = (event: PointerEvent) => {
      const id = Date.now();
      setBursts((items) => [...items.slice(-4), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setBursts((items) => items.filter((item) => item.id !== id));
      }, 820);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handleDown);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.035) 32%, transparent 68%)`,
        }}
      />
      <motion.div
        className="absolute h-7 w-7 rounded-full border border-amber-300/70 shadow-[0_0_24px_rgba(245,158,11,0.7)] mix-blend-screen"
        animate={{ x: position.x - 14, y: position.y - 14 }}
        transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.15 }}
      />
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,1)]"
        animate={{ x: position.x - 4, y: position.y - 4 }}
        transition={{ type: 'spring', stiffness: 760, damping: 26, mass: 0.08 }}
      />
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
          {[...Array(12)].map((_, index) => (
            <span
              key={index}
              className="click-spark"
              style={{ '--angle': `${index * 30}deg` } as CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const feedItems = [
  { icon: <Sparkles className="h-3.5 w-3.5" />, label: 'AI matched Nexus AI with 3 editors', value: '98.6%' },
  { icon: <Zap className="h-3.5 w-3.5" />, label: 'Brief generated for launch campaign', value: '12s' },
  { icon: <Activity className="h-3.5 w-3.5" />, label: 'Escrow milestone safely locked', value: '$8.4k' },
  { icon: <Radio className="h-3.5 w-3.5" />, label: 'Creator portfolio verified live', value: '4.9' },
];

interface LiveOpsFeedProps {
  onNavigate: (sectionId: string) => void;
}

export const LiveOpsFeed = ({ onNavigate }: LiveOpsFeedProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % feedItems.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  const item = feedItems[active];

  return (
    <button
      onClick={() => onNavigate('brief-builder')}
      className="fixed bottom-5 left-5 z-40 hidden w-[330px] overflow-hidden rounded-2xl border border-amber-500/25 bg-black/70 p-3 text-left text-xs shadow-2xl shadow-amber-500/10 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-amber-400/60 lg:block"
      aria-label="Open AI brief builder"
    >
      <div className="absolute inset-0 live-card-scan opacity-60" />
      <div className="relative flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30">
          <span className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md" />
          {item.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,1)]" />
            Live AI Ops
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="truncate font-semibold text-zinc-100"
          >
            {item.label}
          </motion.div>
        </div>
        <motion.div
          key={item.value}
          initial={{ scale: 0.72, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="rounded-xl bg-amber-500 px-2.5 py-1.5 font-black text-black shadow-[0_0_24px_rgba(245,158,11,0.35)]"
        >
          {item.value}
        </motion.div>
      </div>
    </button>
  );
};
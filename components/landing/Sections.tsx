import { Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  Clapperboard,
  FileSignature,
  Hand,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Scissors,
  TrendingUp,
  Users,
} from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  CTA,
  FEATURES,
  FOOTER,
  HERO,
  MARKET,
  PROBLEM,
  REVENUE,
  ROADMAP,
  ROLE_BUTTONS,
  SOLUTION,
  VISION,
  COMPETITORS,
} from './content';
import { NetworkDiagram, ShieldDiagram } from './Diagrams';
import CompetitorTabs from './CompetitorTabs';

// ── Hero ─────────────────────────────────────────────────────────────
const FLOAT_ICONS = [Bot, ShieldCheck, TrendingUp];

export function Hero() {
  let wordIndex = 0;
  return (
    <section id="hero" className="fx-hero" data-chapter="hero" aria-labelledby="fx-hero-title">
      <div className="fx-wrap fx-hero__grid">
        <div className="fx-hero__copy">
          <p className="fx-chip">
            <span className="fx-chip__dot" aria-hidden="true" />
            {HERO.eyebrow}
          </p>
          <h1 id="fx-hero-title" className="fx-hero__title">
            {HERO.lines.map((line, li) => (
              <span className="fx-line" key={li}>
                {line.map((w) => {
                  const i = wordIndex++;
                  return (
                    <Fragment key={w.w}>
                      <span className="fx-word">
                        <span className={w.accent ? 'fx-word__in fx-grad' : 'fx-word__in'} style={{ ['--i' as string]: i }}>
                          {w.w}
                        </span>
                      </span>{' '}
                    </Fragment>
                  );
                })}
              </span>
            ))}
          </h1>
          <p className="fx-hero__sub fx-intro" style={{ ['--i' as string]: 5 }}>
            {HERO.sub}
          </p>
          <div className="fx-hero__ctas fx-intro" style={{ ['--i' as string]: 6 }}>
            <Link href={HERO.cta.href} className="fx-btn fx-btn--primary fx-btn--lg">
              {HERO.cta.label} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href={HERO.secondary.href} className="fx-btn fx-btn--ghost fx-btn--lg">
              <Play size={16} aria-hidden="true" /> {HERO.secondary.label}
            </a>
          </div>
        </div>

        <div className="fx-hero__visual" data-anchor="hero" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fx-hero__poster" src="/landing/knot-poster.webp" alt="" width={720} height={720} fetchPriority="high" />
          <div className="fx-hero__grab" data-knot-grab>
            <span className="fx-hint">
              <Hand size={14} /> Drag to spin
            </span>
          </div>
          {HERO.floats.map((f, i) => {
            const Icon = FLOAT_ICONS[i];
            return (
              <div className={`fx-notify fx-hero__float fx-hero__float--${i + 1}`} data-float={String(0.3 + i * 0.25)} key={f.title}>
                <span className="fx-notify__icon">
                  <Icon size={16} />
                </span>
                <span className="fx-notify__text">
                  <strong>{f.title}</strong>
                  <span>{f.meta}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <dl className="fx-wrap fx-stats fx-intro" style={{ ['--i' as string]: 7 }}>
        {HERO.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </dd>
          </div>
        ))}
      </dl>

      <a href="#problem" className="fx-scrollcue" aria-label="Scroll to the next section">
        <span />
      </a>
    </section>
  );
}

// ── The Problem ──────────────────────────────────────────────────────
const PROBLEM_ICONS = [Building2, Clapperboard, Scissors];

export function Problem() {
  return (
    <section id="problem" className="fx-problem" data-chapter="problem" aria-labelledby="fx-problem-title">
      <p className="fx-wrap fx-eyebrow" data-reveal>
        {PROBLEM.eyebrow}
      </p>
      <div className="fx-marquee" aria-hidden="true">
        {PROBLEM.rows.map((row, i) => (
          <div className="fx-marquee__row" data-marquee key={i}>
            {[...row, ...row].map((t, k) => (
              <span key={k}>
                {t}
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="fx-wrap fx-problem__body">
        <h2 id="fx-problem-title" data-reveal>
          {PROBLEM.title} <span className="fx-grad">{PROBLEM.titleAccent}</span>
        </h2>
        <p data-reveal="1">{PROBLEM.body}</p>
      </div>
      <div className="fx-wrap fx-pains">
        {PROBLEM.cards.map((c, i) => {
          const Icon = PROBLEM_ICONS[i];
          return (
            <article className="fx-card fx-pain" data-reveal={String(i)} data-tilt key={c.title}>
              <span className="fx-tool__icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── The Solution: three portals as pinned steps ──────────────────────
export function Solution() {
  return (
    <section id="solution" className="fx-how" data-chapter="how" data-how aria-labelledby="fx-how-title">
      <div className="fx-how__sticky">
        <div className="fx-wrap fx-how__grid">
          <div className="fx-how__copy">
            <p className="fx-eyebrow">{SOLUTION.eyebrow}</p>
            <h2 id="fx-how-title">
              {SOLUTION.title[0]} <span className="fx-grad">{SOLUTION.title[1]}</span> {SOLUTION.title[2]}
            </h2>
            <p className="fx-how__intro">{SOLUTION.intro}</p>
            <ol className="fx-steps">
              {SOLUTION.portals.map((s, i) => (
                <li key={s.n} data-step data-active={i === 0 ? '' : undefined}>
                  <span className="fx-steps__n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <div className="fx-steps__body">
                      <div className="fx-steps__inner">
                        <ul className="fx-steps__list">
                          {s.points.map((p) => (
                            <li key={p}>
                              <Check size={15} aria-hidden="true" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="fx-how__bar" aria-hidden="true">
              <span />
            </div>
          </div>
          <div className="fx-how__visual fx-3d-slot" data-anchor="how" aria-hidden="true">
            <NetworkDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── What Makes Us Different: bento grid ──────────────────────────────
const FEATURE_ICONS = [Star, Sparkles, BarChart3, ShieldCheck, Users, Store, MessageSquareText, FileSignature];

export function Features() {
  return (
    <section id="differentiators" className="fx-tools" data-chapter="tools" aria-labelledby="fx-features-title">
      <div className="fx-wrap">
        <header className="fx-head">
          <p className="fx-eyebrow" data-reveal>
            {FEATURES.eyebrow}
          </p>
          <h2 id="fx-features-title" data-reveal="1">
            {FEATURES.title} <span className="fx-grad">{FEATURES.titleAccent}</span>
          </h2>
        </header>

        <div className="fx-bento">
          {FEATURES.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <article className={`fx-card fx-feature fx-feature--${f.n}`} data-reveal={String(i % 3)} key={f.n}>
                <div className="fx-feature__head">
                  <span className="fx-tool__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="fx-feature__n">{f.n}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>

                {/* 01: example score breakdown */}
                {f.n === '01' && (
                  <div className="fx-score" aria-hidden="true">
                    {FEATURES.scoreExample.map((s) => (
                      <div className="fx-score__row" key={s.label}>
                        <span>{s.label}</span>
                        <span className="fx-score__bar">
                          <i style={{ width: `${s.value}%` }} />
                        </span>
                        <b>{s.value}</b>
                      </div>
                    ))}
                  </div>
                )}

                {/* 04: the payment clearing, filled by scroll */}
                {f.n === '04' && (
                  <div className="fx-escrow" aria-hidden="true">
                    <div className="fx-escrow__held" data-tilt>
                      <span className="fx-ui__tag">Example</span>
                      <span className="fx-escrow__label">
                        <ShieldCheck size={14} /> {FEATURES.escrowExample.label}
                      </span>
                      <strong>
                        <AnimatedCounter value={FEATURES.escrowExample.amount} prefix="₹" duration={1600} />
                      </strong>
                      <span className="fx-escrow__meta">{FEATURES.escrowExample.meta}</span>
                    </div>
                  </div>
                )}
                {f.n === '04' && (
                  <div className="fx-rail fx-rail--4 fx-feature__rail" data-rail aria-hidden="true">
                    <div className="fx-rail__track">
                      <span />
                    </div>
                    <ol>
                      {FEATURES.escrowFlow.map((r) => (
                        <li key={r} data-rail-node>
                          <i />
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {f.n === '04' && (
                  <div className="fx-escrow__receipt" data-float="0.25" aria-hidden="true">
                    <span className="fx-escrow__tick">
                      <Check size={16} />
                    </span>
                    <span>
                      <strong>{FEATURES.escrowExample.released}</strong>
                      <em>{FEATURES.escrowExample.releasedMeta}</em>
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Market Opportunity ───────────────────────────────────────────────
export function Market() {
  return (
    <section id="market" className="fx-money" data-chapter="money" aria-labelledby="fx-market-title">
      <div className="fx-wrap fx-money__grid">
        <div className="fx-money__visual fx-3d-slot" aria-hidden="true">
          <ShieldDiagram />
        </div>
        <div className="fx-money__copy">
          <p className="fx-eyebrow" data-reveal>
            {MARKET.eyebrow}
          </p>
          <h2 id="fx-market-title" data-reveal="1">
            {MARKET.titleLead}
            <span className="fx-grad">{MARKET.titleAccent}</span>
            {MARKET.titleTail} {MARKET.titleLine2}
          </h2>

          <div className="fx-metric fx-metric--hero" data-reveal>
            <span className="fx-metric__label">{MARKET.headline.label}</span>
            <strong className="fx-grad">{MARKET.headline.value}</strong>
            <span className="fx-metric__note">{MARKET.headline.note}</span>
          </div>
          <div className="fx-metrics">
            {MARKET.metrics.map((m, i) => (
              <div className="fx-card fx-metric" data-reveal={String(i % 2)} key={m.label}>
                <span className="fx-metric__label">{m.label}</span>
                <strong>{m.value}</strong>
                <span className="fx-metric__note">{m.note}</span>
              </div>
            ))}
          </div>

          <div className="fx-market__text" data-reveal>
            {MARKET.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <blockquote>{MARKET.quote}</blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Competitive Landscape ────────────────────────────────────────────
export function Competitors() {
  return (
    <section id="competitors" className="fx-roles fx-competitors" data-chapter="roles" aria-labelledby="fx-competitors-title">
      <div className="fx-wrap">
        <header className="fx-head">
          <p className="fx-eyebrow" data-reveal>
            {COMPETITORS.eyebrow}
          </p>
          <h2 id="fx-competitors-title" data-reveal="1">
            {COMPETITORS.title} <span className="fx-grad">{COMPETITORS.titleAccent}</span>
            {COMPETITORS.titleTail}
          </h2>
        </header>
        <CompetitorTabs />
      </div>
    </section>
  );
}

// ── Business Model + Roadmap (the cream block) ───────────────────────
export function BusinessModel() {
  return (
    <section id="revenue" className="fx-pricing" data-chapter="pricing" data-opaque aria-labelledby="fx-revenue-title">
      <div className="fx-wrap">
        <header className="fx-head">
          <p className="fx-eyebrow" data-reveal>
            {REVENUE.eyebrow}
          </p>
          <h2 id="fx-revenue-title" data-reveal="1">
            {REVENUE.title} <span className="fx-ink-accent">{REVENUE.titleAccent}</span>
          </h2>
        </header>

        <div className="fx-plans fx-streams">
          {REVENUE.streams.map((s, i) => (
            <article className="fx-plan fx-stream" data-reveal={String(i % 3)} key={s.title}>
              <p className="fx-plan__price">{s.value}</p>
              <h3>{s.title}</h3>
              <p className="fx-stream__body">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="fx-milestones">
          {REVENUE.milestones.map((m, i) => (
            <div className="fx-milestone" data-reveal={String(i)} key={m.label}>
              <span>{m.when}</span>
              <strong className={m.accent ? 'fx-ink-accent' : undefined}>{m.value}</strong>
              <em>{m.label}</em>
            </div>
          ))}
        </div>

        <div id="roadmap" className="fx-roadmap">
          <header className="fx-head">
            <p className="fx-eyebrow" data-reveal>
              {ROADMAP.eyebrow}
            </p>
            <h2 data-reveal="1">
              {ROADMAP.title} <span className="fx-ink-accent">{ROADMAP.titleAccent}</span>
            </h2>
          </header>
          <ol className="fx-timeline">
            {ROADMAP.phases.map((p) => (
              <li key={p.when} data-done={p.done ? '' : undefined} data-reveal>
                <span className="fx-timeline__dot" aria-hidden="true" />
                <p className="fx-timeline__when">{p.when}</p>
                <h3>{p.title}</h3>
                <div className="fx-timeline__chips">
                  {p.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── Vision ───────────────────────────────────────────────────────────
export function Vision() {
  return (
    <section id="vision" className="fx-vision" aria-labelledby="fx-vision-title">
      <div className="fx-wrap">
        <header className="fx-head fx-head--center">
          <p className="fx-eyebrow" data-reveal>
            {VISION.eyebrow}
          </p>
          <h2 id="fx-vision-title" data-reveal="1">
            {VISION.quoteLead}
            <span className="fx-grad">{VISION.quoteAccent}</span>
            {VISION.quoteTail}
          </h2>
          <p className="fx-vision__body" data-reveal="2">
            {VISION.body}
          </p>
          <a href={VISION.button.href} className="fx-btn fx-btn--primary fx-btn--lg" data-reveal="3">
            {VISION.button.label} <ArrowRight size={18} aria-hidden="true" />
          </a>
        </header>
      </div>
    </section>
  );
}

// ── Final call to action ─────────────────────────────────────────────
export function FinalCta() {
  return (
    <section id="cta" className="fx-cta" data-chapter="cta" aria-labelledby="fx-cta-title">
      <div className="fx-wrap">
        <div className="fx-cta__space" data-anchor="cta" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fx-cta__poster" src="/landing/knot-poster.webp" alt="" width={720} height={720} loading="lazy" decoding="async" />
        </div>
        <p className="fx-eyebrow fx-cta__eyebrow" data-reveal>
          {CTA.eyebrow}
        </p>
        <h2 id="fx-cta-title" className="fx-cta__title" data-reveal>
          {CTA.title} <span className="fx-grad">{CTA.titleAccent}</span>
        </h2>
        <p data-reveal="1">{CTA.sub}</p>
        <div className="fx-cta__buttons" data-reveal="2">
          <Link href={ROLE_BUTTONS.creator.href} className="fx-btn fx-btn--primary fx-btn--lg">
            {ROLE_BUTTONS.creator.label} <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={ROLE_BUTTONS.brand.href} className="fx-btn fx-btn--primary fx-btn--lg">
            {ROLE_BUTTONS.brand.label} <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={ROLE_BUTTONS.editor.href} className="fx-btn fx-btn--ghost fx-btn--lg">
            {ROLE_BUTTONS.editor.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer (original links and wording) ──────────────────────────────
export function LandingFooter() {
  return (
    <footer id="contact" className="fx-footer">
      <div className="fx-wrap fx-footer__grid">
        <div className="fx-footer__brand">
          <Link href="/" className="fx-nav__brand" aria-label="Fewsion home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={30} height={30} />
            <span>
              Few<em>sion</em>
            </span>
          </Link>
          <p>{FOOTER.blurb}</p>
        </div>
        <nav aria-label="Platform">
          <h3>Platform</h3>
          <Link href="/creators">For Creators</Link>
          <Link href="/brands">Live Campaigns</Link>
          <Link href="/editors">For Editors</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <nav aria-label="Company">
          <h3>Company</h3>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/careers">Careers</Link>
          <a href="mailto:founders@fewsion.in">Contact</a>
        </nav>
        <nav aria-label="Legal">
          <h3>Legal</h3>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookie">Cookie Policy</Link>
        </nav>
      </div>
      <div className="fx-wrap fx-footer__bottom">
        <span>
          © {new Date().getFullYear()} {FOOTER.company}. All rights reserved.
        </span>
        <span>Where Brands Meet Creators</span>
      </div>
    </footer>
  );
}

import { Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clapperboard,
  Hand,
  Link2,
  Mail,
  MessageCircle,
  Play,
  Plus,
  ScanLine,
  Scissors,
  ShieldCheck,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import {
  BRIEF_EXAMPLE,
  CONTACT,
  CTA,
  FAQ,
  HERO,
  JOIN,
  MONEY,
  PRICING,
  PROBLEM,
  ROLE_BUTTONS,
  ROLES,
  STATUS,
  STEPS,
  VIDEO_CHECKS,
  type Status,
} from './content';
import { NetworkDiagram, ShieldDiagram } from './Diagrams';

// "Live" or "Coming Q1 2027": every feature says honestly whether it exists yet.
function StatusChip({ status }: { status: Status }) {
  return <span className={status.live ? 'fx-status fx-status--live' : 'fx-status'}>{status.label}</span>;
}

// Highlights [bracketed] placeholders so unfinished copy can't ship unnoticed.
function Fill({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith('[') ? (
          <mark className="fx-tbd" key={i}>
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

export function Hero() {
  let wordIndex = 0;
  return (
    <section className="fx-hero" data-chapter="hero" aria-labelledby="fx-hero-title">
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
          <p className="fx-hero__sub fx-intro" style={{ ['--i' as string]: 6 }}>
            {HERO.sub}
          </p>
          <div className="fx-hero__ctas fx-intro" style={{ ['--i' as string]: 7 }}>
            <Link href={HERO.cta.href} className="fx-btn fx-btn--primary fx-btn--lg">
              {HERO.cta.label} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href={HERO.secondary.href} className="fx-btn fx-btn--ghost fx-btn--lg">
              <Play size={16} aria-hidden="true" /> {HERO.secondary.label}
            </a>
          </div>
          <ul className="fx-hero__proof fx-intro" style={{ ['--i' as string]: 8 }}>
            {HERO.proof.map((p) => (
              <li key={p.label}>
                <Check size={16} aria-hidden="true" />
                <span>{p.label}</span>
                <StatusChip status={p.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="fx-hero__visual" data-anchor="hero" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fx-hero__poster" src="/landing/knot-poster.webp" alt="" width={720} height={720} fetchPriority="high" />
          <div className="fx-hero__grab" data-knot-grab>
            <span className="fx-hint">
              <Hand size={14} /> Drag to spin
            </span>
          </div>
        </div>
      </div>
      <a href="#problem" className="fx-scrollcue" aria-label="Scroll to the next section">
        <span />
      </a>
    </section>
  );
}

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
      <ul className="fx-sr-only">
        {PROBLEM.rows.flat().map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="fx-wrap fx-problem__body">
        <h2 id="fx-problem-title" data-reveal>
          {PROBLEM.title}
        </h2>
        <p data-reveal="1">{PROBLEM.body}</p>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="fx-how" data-chapter="how" data-how aria-labelledby="fx-how-title">
      <div className="fx-how__sticky">
        <div className="fx-wrap fx-how__grid">
          <div className="fx-how__copy">
            <p className="fx-eyebrow">How it works</p>
            <h2 id="fx-how-title">
              From product link to approved video <span className="fx-grad">in four steps.</span>
            </h2>
            <ol className="fx-steps">
              {STEPS.map((s, i) => (
                <li key={s.n} data-step data-active={i === 0 ? '' : undefined}>
                  <span className="fx-steps__n">{s.n}</span>
                  <div>
                    <h3>
                      {s.title} <StatusChip status={s.status} />
                    </h3>
                    <div className="fx-steps__body">
                      <p>{s.body}</p>
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

export function AiTools() {
  return (
    <section id="ai" className="fx-tools" data-chapter="tools" aria-labelledby="fx-tools-title">
      <div className="fx-wrap">
        <header className="fx-head">
          <p className="fx-eyebrow" data-reveal>
            The difference
          </p>
          <h2 id="fx-tools-title" data-reveal="1">
            Other platforms find you a creator. <span className="fx-grad">Fewsion makes sure the video is right.</span>
          </h2>
        </header>

        <div className="fx-tools__grid">
          <article className="fx-tool" data-reveal>
            <div className="fx-tool__head">
              <span className="fx-tool__icon">
                <Sparkles size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>
                  AI Brief Builder <StatusChip status={STATUS.briefBuilder} />
                </h3>
                <p>A product link in, a brief creators can’t misread out.</p>
              </div>
            </div>
            <div className="fx-ui fx-brief" data-brief data-tilt>
              <span className="fx-ui__tag">Example</span>
              <div className="fx-brief__bar">
                <Link2 size={16} aria-hidden="true" />
                <span data-brief-url>{BRIEF_EXAMPLE.url}</span>
                <span className="fx-brief__btn" data-brief-btn>
                  Write brief
                </span>
              </div>
              <div className="fx-brief__body">
                <div data-brief-part>
                  <h4>Goal</h4>
                  <p>{BRIEF_EXAMPLE.goal}</p>
                </div>
                <div data-brief-part>
                  <h4>Hook options</h4>
                  <ol>
                    {BRIEF_EXAMPLE.hooks.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ol>
                </div>
                <div data-brief-part>
                  <h4>Shot list</h4>
                  <ul>
                    {BRIEF_EXAMPLE.shots.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="fx-brief__split" data-brief-part>
                  <div>
                    <h4>Must say</h4>
                    {BRIEF_EXAMPLE.mustSay.map((m) => (
                      <span className="fx-pill fx-pill--ok" key={m}>
                        {m}
                      </span>
                    ))}
                  </div>
                  <div>
                    <h4>Avoid</h4>
                    {BRIEF_EXAMPLE.avoid.map((m) => (
                      <span className="fx-pill fx-pill--no" key={m}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="fx-brief__format" data-brief-part>
                  <h4>Format</h4>
                  <p>{BRIEF_EXAMPLE.format}</p>
                </div>
              </div>
            </div>
          </article>

          <article className="fx-tool" data-reveal="1">
            <div className="fx-tool__head">
              <span className="fx-tool__icon">
                <ScanLine size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>
                  AI Video Check <StatusChip status={STATUS.videoCheck} />
                </h3>
                <p>Every draft tested against the brief before you see it.</p>
              </div>
            </div>
            <div className="fx-ui fx-check" data-check data-tilt>
              <span className="fx-ui__tag">Example</span>
              <div className="fx-check__phone" aria-hidden="true">
                <div className="fx-check__screen">
                  <span className="fx-check__scan" />
                  <span className="fx-check__play">
                    <Play size={18} />
                  </span>
                  <span className="fx-check__time">0:24</span>
                </div>
              </div>
              <ul className="fx-check__list">
                {VIDEO_CHECKS.map((c) => (
                  <li key={c.label} data-check-row data-pass={c.pass ? 'yes' : 'no'}>
                    <span className="fx-check__icon" aria-hidden="true">
                      {c.pass ? <Check size={14} /> : <X size={14} />}
                    </span>
                    <span>
                      <span className="fx-sr-only">{c.pass ? 'Passed: ' : 'Failed: '}</span>
                      {c.label}
                      {c.fix && (
                        <em className="fx-check__fix" data-check-fix>
                          {c.fix}
                        </em>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="fx-check__verdict" data-check-verdict>
                <strong>5 of 6 passed.</strong> Sent back to the creator with 1 fix. You’ll see it once it passes.
              </div>
            </div>
          </article>
        </div>

        <p className="fx-tools__note" data-reveal>
          <ShieldCheck size={18} aria-hidden="true" />
          When the AI isn’t sure, it fails the draft and a person on our team takes a look.
        </p>
      </div>
    </section>
  );
}

export function Money() {
  return (
    <section id="money" className="fx-money" data-chapter="money" aria-labelledby="fx-money-title">
      <div className="fx-wrap fx-money__grid">
        <div className="fx-money__visual fx-3d-slot" aria-hidden="true">
          <ShieldDiagram />
        </div>
        <div className="fx-money__copy">
          <p className="fx-eyebrow" data-reveal>
            {MONEY.eyebrow} <StatusChip status={STATUS.payments} />
          </p>
          <h2 id="fx-money-title" data-reveal="1">
            How your money is <span className="fx-grad">protected.</span>
          </h2>

          <div className="fx-rail" data-rail>
            <div className="fx-rail__track" aria-hidden="true">
              <span />
            </div>
            <ol>
              {MONEY.rail.map((r) => (
                <li key={r} data-rail-node>
                  <i aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ol>
          </div>

          <ol className="fx-rules">
            {MONEY.rules.map((r, i) => (
              <li className="fx-card fx-rule" data-reveal={String(i % 2)} key={r.title}>
                <span className="fx-rule__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{r.title}</h3>
                <p>
                  <Fill text={r.body} />
                </p>
              </li>
            ))}
          </ol>

          <div className="fx-example" data-reveal>
            <span className="fx-ui__tag">Example</span>
            <h3>{MONEY.example.title}</h3>
            <dl>
              {MONEY.example.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="fx-money__note">
            {MONEY.note} Values in <mark className="fx-tbd">[brackets]</mark> are placeholders until those terms are final.
          </p>
        </div>
      </div>
    </section>
  );
}

const ROLE_ICONS = [Store, Clapperboard, Scissors];

export function Roles() {
  return (
    <section className="fx-roles" data-chapter="roles" aria-labelledby="fx-roles-title">
      <div className="fx-wrap">
        <header className="fx-head">
          <p className="fx-eyebrow" data-reveal>
            Built for all three sides
          </p>
          <h2 id="fx-roles-title" data-reveal="1">
            One project. Three people. <span className="fx-grad">Everyone on the same brief.</span>
          </h2>
        </header>
      </div>
      {ROLES.map((r, i) => {
        const Icon = ROLE_ICONS[i];
        return (
          <article id={r.id} className="fx-role" data-role-card key={r.id} aria-labelledby={`fx-role-${r.id}`}>
            <div className="fx-wrap fx-role__grid">
              <div className="fx-role__copy">
                <p className="fx-role__tags">
                  <span className="fx-role__tag">
                    <Icon size={16} aria-hidden="true" />
                    {r.tag}
                  </span>
                  {r.status && <StatusChip status={r.status} />}
                </p>
                <h3 id={`fx-role-${r.id}`} data-reveal>
                  {r.title}
                </h3>
                <ul className="fx-ticks" data-reveal="1">
                  {r.points.map((p) => (
                    <li key={p}>
                      <Check size={16} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="fx-role__actions" data-reveal="2">
                  <Link href={r.button.href} className="fx-btn fx-btn--primary">
                    {r.button.label} <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <div className="fx-notify" data-float="0.5" aria-hidden="true">
                  <span className="fx-ui__tag">Example</span>
                  <span className="fx-notify__icon">
                    <Icon size={16} />
                  </span>
                  <span className="fx-notify__text">
                    <strong>{r.card.title}</strong>
                    <span>{r.card.meta}</span>
                  </span>
                  <em>{r.card.status}</em>
                </div>
              </div>
              <div className="fx-role__visual fx-3d-slot" aria-hidden="true">
                <NetworkDiagram focus={i} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="fx-pricing" data-chapter="pricing" data-opaque aria-labelledby="fx-pricing-title">
      <div className="fx-wrap">
        <header className="fx-head fx-head--center">
          <p className="fx-eyebrow" data-reveal>
            Pricing
          </p>
          <h2 id="fx-pricing-title" data-reveal="1">
            Free to start. A fee only when a project is paid.
          </h2>
        </header>
        <div className="fx-plans">
          {PRICING.map((p, i) => (
            <article className="fx-plan" data-featured={p.featured ? '' : undefined} data-reveal={String(i)} key={p.who}>
              <h3>{p.who}</h3>
              <p className="fx-plan__price">
                {p.price} <span>{p.unit}</span>
              </p>
              <ul>
                {p.lines.map((l) => (
                  <li key={l}>
                    <Check size={16} aria-hidden="true" />
                    {l}
                  </li>
                ))}
              </ul>
              <Link href={JOIN.href} className={p.featured ? 'fx-btn fx-btn--dark' : 'fx-btn fx-btn--outline'}>
                {JOIN.label} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
        <p className="fx-pricing__more">
          <Link href="/pricing">
            See full pricing and plan details <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </p>

        <div className="fx-faq" id="faq">
          <h3>Questions, answered</h3>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>
                <Fill text={f.a} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="get-started" className="fx-cta" data-chapter="cta" aria-labelledby="fx-cta-title">
      <div className="fx-wrap">
        <div className="fx-cta__space" data-anchor="cta" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fx-cta__poster" src="/landing/knot-poster.webp" alt="" width={720} height={720} loading="lazy" decoding="async" />
        </div>
        <h2 id="fx-cta-title" data-reveal>
          {CTA.title}
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
          <p>AI briefs, checked drafts and protected payments for D2C brands, UGC creators and video editors.</p>
          <div className="fx-footer__contact">
            <h3>Talk to a person</h3>
            <p>
              <MessageCircle size={16} aria-hidden="true" />
              <span>
                WhatsApp or call <Fill text={CONTACT.whatsapp} />
              </span>
            </p>
            <p>
              <span className="fx-footer__icon-gap" aria-hidden="true" />
              <Fill text={CONTACT.hours} />
            </p>
            <p>
              <Mail size={16} aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
        </div>
        <nav aria-label="On this page">
          <h3>On this page</h3>
          <a href="#how">How it works</a>
          <a href="#ai">AI tools</a>
          <a href="#money">Payment protection</a>
          <a href="#faq">FAQ</a>
        </nav>
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
          <a href={`mailto:${CONTACT.email}`}>Contact</a>
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
          © {new Date().getFullYear()} {CONTACT.company} · {CONTACT.registration} · <Fill text={CONTACT.gstin} /> · {CONTACT.city}
        </span>
        <span>Where Brands Meet Creators</span>
      </div>
    </footer>
  );
}

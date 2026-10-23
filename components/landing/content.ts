// All landing-page copy lives here so it can be reviewed and edited in one place.
// The wording is the original Fewsion home page; the layout, styles and scroll
// animations come from the landing components around it.

// Buttons and nav keep the live site's original labels and destinations.
export const JOIN = { label: 'Join Waitlist', href: '/signup' };
export const LOGIN = { label: 'Login', href: '/login' };

export const NAV_LINKS = [
  { href: '/creators', label: 'Creators' },
  { href: '/brands', label: 'Brands' },
  { href: '/editors', label: 'Editors' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

// The original "I'm a …" buttons.
export const ROLE_BUTTONS = {
  creator: { label: 'I’m a Creator', href: '/creators' },
  brand: { label: 'I’m a Brand', href: '/brands' },
  editor: { label: 'I’m an Editor', href: '/editors' },
};

// ── Hero ─────────────────────────────────────────────────────────────
export const HERO = {
  eyebrow: 'India’s First Performance-First Creator Marketplace',
  // Rendered word by word for the intro animation; `accent` words get the gradient.
  lines: [
    [{ w: 'Where' }, { w: 'Brands', accent: true }],
    [{ w: 'Meet' }, { w: 'Creators', accent: true }],
  ],
  sub: 'Fewsion connects D2C brands, UGC content creators, and video editors — powered by AI matching, verified performance data, and built-in escrow payments.',
  cta: { label: 'Join the waitlist', href: '/signup' },
  secondary: { label: 'See how it works', href: '#solution' },
  // Animated counters under the hero
  stats: [
    { value: 3500, prefix: '₹', suffix: 'Cr', label: 'Indian Market Size' },
    { value: 4.5, decimals: 1, suffix: 'M+', label: 'Indian Creators' },
    { value: 323, prefix: '$', suffix: 'B', label: 'Global Creator Economy' },
    { value: 26, suffix: '%', label: 'Annual Growth Rate' },
  ],
  // Small floating status cards around the 3D logo
  floats: [
    { title: 'AI matched: 96% fit', meta: 'Found 12 creators (98%)' },
    { title: 'Escrow released ₹45,000', meta: '₹2,50,000 milestone secured' },
    { title: 'Verified: 2.4M views delivered', meta: 'UGC CTR: +8.4%' },
  ],
};

// ── The Problem ──────────────────────────────────────────────────────
export const PROBLEM = {
  eyebrow: 'The Problem',
  // Short phrases from the three cards below, for the sliding marquee
  rows: [
    ['Hired by follower count', 'Zero performance data', 'Contracts scattered across WhatsApp, email, Notion', 'High drop-off, no accountability'],
    ['No portfolio built for UGC', 'Payment delays with no escrow', 'Editors hired only through connections', 'Inconsistent income'],
  ],
  title: 'The creator economy is broken',
  titleAccent: 'for everyone involved',
  body: 'Brands, creators, and editors all face painful friction — and no existing platform solves all three.',
  cards: [
    {
      title: 'For Brands',
      body: 'No reliable way to find quality UGC creators at scale. Brands hire based on follower count with zero performance data. Contracts and payments scattered across WhatsApp, email, Notion — high drop-off, no accountability.',
    },
    {
      title: 'For Creators',
      body: 'No professional portfolio built for UGC or short-form content. Hard to discover what brands actually want. Payment delays with no escrow protection. No easy way to collaborate with editors.',
    },
    {
      title: 'For Editors',
      body: 'Invisible to brands — editors only get hired through personal connections. No platform to showcase reel, ad, or short-form editing work. Inconsistent income, no long-term client relationships.',
    },
  ],
};

// ── The Solution (pinned steps) ──────────────────────────────────────
export const SOLUTION = {
  eyebrow: 'The Solution',
  title: ['One platform.', 'Three portals.', 'One AI brain.'],
  intro:
    'Fewsion unifies every stakeholder in the creator economy — with AI-powered matching, performance tracking, escrow payments, and built-in collaboration tools.',
  portals: [
    {
      n: '01',
      title: 'Creator Portal',
      points: [
        'Performance-backed portfolio & niche tagging',
        'Real CTR and engagement stats on every piece',
        'Invite editors directly into your projects',
        'Browse & apply to brand campaigns',
        'Escrow-protected payments',
      ],
    },
    {
      n: '02',
      title: 'Brand Portal',
      points: [
        'AI-powered brief builder in seconds',
        'Discover creators by proven performance, not followers',
        'Post UGC, ad video, and content campaigns',
        'AI chatbot to find the right creator instantly',
        'Public brand storefront with creator reviews',
      ],
    },
    {
      n: '03',
      title: 'Editor Portal',
      points: [
        'First Indian platform with a dedicated editor marketplace',
        'Showcase reels, ad edits, short-form work',
        'Get hired by brands directly — not just creators',
        'Receive collab invites from creators on projects',
        'Performance rating builds long-term reputation',
      ],
    },
  ],
};

// ── What Makes Us Different ──────────────────────────────────────────
export const FEATURES = {
  eyebrow: 'What Makes Us Different',
  title: '8 features no Indian',
  titleAccent: 'platform has today',
  items: [
    {
      n: '01',
      title: 'Performance-Based Creator Score',
      body: 'A public trust score built on on-time delivery, brand satisfaction, content CTR, and repeat hire rate — not follower count.',
    },
    {
      n: '02',
      title: 'AI Campaign Brief Builder',
      body: 'Brands auto-generate structured, professional campaign briefs in seconds. Reduces back-and-forth and creator drop-off dramatically.',
    },
    {
      n: '03',
      title: 'Content Performance Tracker',
      body: 'Track real ad performance after delivery — views, clicks, CTR, conversions. Creators build data-backed portfolios, brands get proof of ROI.',
    },
    {
      n: '04',
      title: 'Escrow Payment Protection',
      body: 'Brand deposits money upfront via Razorpay escrow. Creator gets paid only after approval. Eliminates payment disputes for both sides.',
    },
    {
      n: '05',
      title: 'Creator ↔ Editor In-Platform Collab',
      body: 'Creators invite editors directly inside any live project. No more WhatsApp back-and-forth. Everything stays on Fewsion.',
    },
    {
      n: '06',
      title: 'Brand Storefront with Creator Reviews',
      body: 'Each company gets a public page with past campaigns and creator reviews. Creators apply to brands they actually want to work with.',
    },
    {
      n: '07',
      title: 'AI Matching Chatbot',
      body: 'Brands type what they need — niche, budget, platform, language — and AI returns the best matched, verified creators instantly.',
    },
    {
      n: '08',
      title: 'One-Click AI Contract Generator',
      body: 'Auto-generated contracts covering usage rights, deadlines, and payment terms. No lawyer, no back-and-forth — just one click.',
    },
  ],
  // The payment flow drawn inside the Escrow card (feature 04)
  escrowFlow: ['Brand deposits upfront', 'Held in Razorpay escrow', 'Content approved', 'Creator gets paid'],
  // Example payment shown inside the Escrow card (figures from the hero cards)
  escrowExample: {
    label: 'Held in escrow',
    amount: 45000,
    meta: 'Campaign milestone · via Razorpay',
    released: 'Payment released to creator',
    releasedMeta: 'Paid out after the brand approved the content',
  },
  // Example creator score shown inside the Creator Score card (feature 01)
  scoreExample: [
    { label: 'On-time delivery', value: 96 },
    { label: 'Brand satisfaction', value: 92 },
    { label: 'Content CTR', value: 84 },
    { label: 'Repeat hire rate', value: 78 },
  ],
};

// ── Market Opportunity ───────────────────────────────────────────────
export const MARKET = {
  eyebrow: 'Market Opportunity',
  titleLead: 'A ',
  titleAccent: '₹3,500 Cr',
  titleTail: ' industry',
  titleLine2: 'with no dominant self-serve player',
  headline: { label: 'Global Creator Economy (2026)', value: '$323 Billion', note: 'Growing at 26.2% CAGR — projected to reach $820B by 2030' },
  metrics: [
    { label: 'India Market (2026)', value: '$15B', note: 'Expected to reach $61.87B by 2033' },
    { label: 'India Growth Rate', value: '22.4%', note: 'CAGR — one of the fastest in Asia' },
    { label: 'Indian Creators', value: '4-5M+', note: 'Active creators across platforms' },
    { label: 'Influencer Marketing India', value: '₹3,500Cr', note: '2025 industry value, growing fast' },
  ],
  paragraphs: [
    'India’s creator economy is exploding — fuelled by 900M+ smartphone users, affordable data, and a massive shift in how D2C brands acquire customers. Brands are moving away from expensive celebrity endorsements and toward authentic, performance-driven UGC content.',
    'Yet every existing Indian platform — Kofluence, Qoruz, Good Creator Co. — serves enterprise brands through agency-style models. There is no self-serve, performance-first marketplace where a small D2C brand can find a quality creator in minutes.',
  ],
  quote: '“Even capturing 0.1% of the Indian market puts Fewsion at ₹35 Cr GMV — a realistic Year 2 target.”',
};

// ── Competitive Landscape ────────────────────────────────────────────
export const COMPETITORS = {
  eyebrow: 'Competitive Landscape',
  title: 'We’re not competing.',
  titleAccent: 'We’re filling a gap',
  titleTail: ' they left open.',
  tabs: [
    {
      id: 'global',
      label: 'Global Platforms',
      head: ['Platform', 'Creators', 'Brands', 'Editors', 'AI Matching', 'India Focus', 'Escrow'],
      rows: [
        ['Collabstr', '✓', '✓', '✗', '✗', '✗', '✗'],
        ['Billo', '✓', '✓', '✗', '✗', '✗', '✗'],
        ['Fiverr', '✓', '✓', '✓', '✗', '✗', '✓'],
        ['Contra', '✓', '✗', '✓', '✗', '✗', '✗'],
        ['Fewsion', '✓', '✓', '✓', '✓', '✓', '✓'],
      ],
    },
    {
      id: 'india',
      label: 'Indian Players',
      head: ['Company', 'Funding', 'Revenue FY25', 'Valuation', 'Self-Serve', 'Editor Mkt.'],
      rows: [
        ['Good Creator Co.', '$306M (group)', '~₹252 Cr', '$1.2B unicorn', '✗ Agency', '✗'],
        ['Kofluence', '₹29.91 Cr', '₹52.5 Cr', 'Undisclosed', '✗ Agency', '✗'],
        ['Qoruz', '$1.03M', '₹56.4 Cr', '~$21–38M', '✗ Analytics', '✗'],
        ['Chtrbox', '~$158K', 'Undisclosed', 'Acquired', '✗ Agency', '✗'],
        ['Fewsion', 'Raising seed', 'Launching 2026', '—', '✓ Self-serve', '✓'],
      ],
    },
    {
      id: 'gap',
      label: 'The Gap We Fill',
      head: ['Gap in Indian Market', 'What Fewsion Does Instead'],
      rows: [
        ['All enterprise / agency tools only', 'Self-serve — any brand posts a campaign in minutes, no sales call'],
        ['Hire by follower count', 'Hire by Creator Score and proven CTR — data beats vanity metrics'],
        ['No editor marketplace', 'First Indian platform where editors get a dedicated portfolio and job listings'],
        ['No escrow payments', 'Razorpay escrow on every deal — money released only after content approved'],
        ['No AI brief builder', 'AI generates structured campaign briefs in seconds'],
        ['No Creator–Editor collaboration', 'Creators invite editors directly inside a project on the same platform'],
      ],
    },
  ],
};

// ── Business Model ───────────────────────────────────────────────────
export const REVENUE = {
  eyebrow: 'Business Model',
  title: 'Multiple revenue streams',
  titleAccent: 'built to scale',
  streams: [
    { value: '10-15%', title: 'Transaction Commission', body: 'A percentage cut on every paid project completed through the platform. Primary revenue driver at scale.' },
    { value: '₹499/mo', title: 'Creator Pro Subscription', body: 'Advanced analytics, priority search ranking, featured profile placement, and AI-powered career insights.' },
    { value: '₹2,999/mo', title: 'Brand Premium Plan', body: 'Unlimited campaign briefs, AI chatbot access, bulk creator outreach, and priority matching.' },
    { value: '₹999', title: 'Featured Brand Listings', body: 'Brands pay to be highlighted to relevant creators, driving faster applications and better talent.' },
    { value: '₹99', title: 'AI Contract Generator', body: 'Per-contract fee for auto-generated usage rights, deadline, and payment agreements — no lawyer needed.' },
    { value: 'Custom', title: 'Enterprise Packages', body: 'White-glove matching, dedicated account management, and bulk campaign tooling for large brands.' },
  ],
  milestones: [
    { when: 'Month 1–3', value: '500', label: 'Creators onboarded' },
    { when: 'Month 6', value: '₹15–20L', label: 'Monthly GMV target' },
    { when: 'Month 6', value: '₹2–3L', label: 'Monthly revenue', accent: true },
    { when: 'Year 2', value: '₹35Cr+', label: 'GMV milestone', accent: true },
  ],
};

// ── Roadmap ──────────────────────────────────────────────────────────
export const ROADMAP = {
  eyebrow: 'Roadmap',
  title: 'From MVP to',
  titleAccent: 'market leader',
  phases: [
    { when: 'Q3 2026 — Launch', title: 'MVP — Core Platform', done: true, items: ['Creator profiles', 'Brand job listings', 'Basic AI matching', 'Niche categories'] },
    { when: 'Q4 2026 — Trust Layer', title: 'Payments + Creator Score', done: true, items: ['Razorpay escrow', 'Creator Score system', 'Editor marketplace', 'Brand reviews'] },
    { when: 'Q1 2027 — AI Layer', title: 'Intelligence Features', items: ['AI brief builder', 'AI contract generator', 'Performance tracker', 'Creator–Editor collab'] },
    { when: 'Q2 2027 — Scale', title: 'Mobile + Growth', items: ['iOS + Android app', 'Referral program', 'SEA market entry', 'Brand storefront V2'] },
    { when: 'Q3 2027 — Funding', title: 'Seed Round + 10K Users', items: ['₹3–5 Cr seed raise', '10,000 active users', 'Enterprise tier launch', 'Social API integrations'] },
  ],
};

// ── Vision ───────────────────────────────────────────────────────────
export const VISION = {
  eyebrow: 'Our Vision',
  quoteLead: '“The only platform where creators are hired based on ',
  quoteAccent: 'proven performance,',
  quoteTail: ' not follower count.”',
  body: 'Fewsion aims to become the default infrastructure for the creator economy in India and Southeast Asia — the place where every brand finds its best creator, every creator builds their legacy, and every editor finally gets the recognition they deserve.',
  button: { label: 'Be part of the story', href: '#cta' },
};

// ── Final call to action ─────────────────────────────────────────────
export const CTA = {
  eyebrow: 'Join Fewsion',
  title: 'Ready to grow with',
  titleAccent: 'India’s creator economy?',
  sub: 'Whether you’re a brand, creator, or editor — Fewsion is building for you. Join the waitlist and be among the first to experience it.',
};

// ── Footer ───────────────────────────────────────────────────────────
export const FOOTER = {
  blurb: 'India’s first performance-first creator marketplace. Connecting brands, creators, and editors — powered by AI.',
  company: 'Fewsion',
};

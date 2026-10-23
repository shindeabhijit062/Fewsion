// All landing-page copy lives here so it can be reviewed and edited in one place.
// Rules for this page (from the Oct 2026 UX review):
// - No numbers we can't back up. Prices come from /pricing; the AI checks come
//   from the MVP scope (Oct 2026). Example UI cards are labelled "Example".
// - Every feature carries an honest status chip (see STATUS).
// - Text in [square brackets] is a placeholder the team must fill in; it renders
//   highlighted so it can't ship unnoticed.

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

// The original "I'm a …" buttons, used per role and in the closing section.
export const ROLE_BUTTONS = {
  creator: { label: 'I’m a Creator', href: '/creators' },
  brand: { label: 'I’m a Brand', href: '/brands' },
  editor: { label: 'I’m an Editor', href: '/editors' },
};

// One source of truth for what exists today. Quarters come from the public
// roadmap on the previous landing page; Video Check comes from the MVP scope and
// isn't on that roadmap yet. Flip a value to 'Live' or 'Beta' when it ships.
export type Status = { label: string; live: boolean };
export const STATUS = {
  matching: { label: 'Live', live: true },
  briefBuilder: { label: 'Coming Q1 2027', live: false },
  videoCheck: { label: 'In development', live: false },
  payments: { label: 'Coming Q4 2026', live: false },
  editorMarketplace: { label: 'Coming Q4 2026', live: false },
} satisfies Record<string, Status>;

export const HERO = {
  eyebrow: 'Early access is open',
  // Rendered word by word for the intro animation; `accent` words get the gradient.
  lines: [
    [{ w: 'Creator' }, { w: 'videos' }],
    [{ w: 'that' }, { w: 'match', accent: true }],
    [{ w: 'your', accent: true }, { w: 'brief.', accent: true }],
  ],
  sub: 'Paste a product link and Fewsion’s AI writes a brief creators can’t misread. Every draft is checked against that brief before it reaches you, and the creator is paid only when you approve.',
  cta: { label: 'Join the waitlist', href: '/signup' },
  secondary: { label: 'See how it works', href: '#how' },
  proof: [
    { label: 'A brief from a product link', status: STATUS.briefBuilder },
    { label: 'Every draft checked against your brief', status: STATUS.videoCheck },
    { label: 'Pay only when you approve', status: STATUS.payments },
  ],
};

export const PROBLEM = {
  eyebrow: 'Sound familiar?',
  rows: [
    ['“Just make it fun, you know?”', 'Three rounds of revisions', 'No hook in the first 3 seconds', 'Product barely on screen'],
    ['Paid upfront, then ghosted', 'Chasing the invoice. Again.', 'Brief lost in a WhatsApp thread', 'Wrong format for the ad'],
  ],
  title: 'Most creator videos go wrong before anyone hits record.',
  body: 'The brief was a vague message, nobody checked the draft against it, and the money moved before the work was right. Fewsion fixes all three.',
};

export const STEPS = [
  {
    n: '01',
    title: 'Paste a product link',
    status: STATUS.briefBuilder,
    body: 'The AI Brief Builder reads your product page and writes the full brief: three hook options, a shot list, must-say points, things to avoid and format rules. Edit anything, then share it as a link.',
  },
  {
    n: '02',
    title: 'Pick your creator',
    status: STATUS.matching,
    body: 'Post the campaign and let AI matching shortlist creators who fit. Invite the one you like. If they need an editor, they bring one onto the same project and the same brief.',
  },
  {
    n: '03',
    title: 'Every draft gets checked',
    status: STATUS.videoCheck,
    body: 'The creator uploads a draft and AI Video Check tests it against your brief, point by point. Misses go back to the creator with a fix list. You only see drafts that pass.',
  },
  {
    n: '04',
    title: 'Approve, and they get paid',
    status: STATUS.payments,
    body: 'Your budget is held before work starts. Approve the video and the creator is paid. Not quite right? Ask for a revision instead.',
  },
];

export const BRIEF_EXAMPLE = {
  url: 'yourbrand.in/products/vitamin-c-serum',
  goal: 'First purchases from Instagram ads',
  hooks: [
    '“Don’t buy a vitamin C serum before watching this”',
    '“My 30-second morning routine, explained”',
    '“3 things I noticed after a week with this”',
  ],
  shots: ['Unbox by a window, natural light', 'Texture close-up on the back of the hand', 'Apply, then the mirror reaction'],
  mustSay: ['Lightweight, absorbs fast', 'Fragrance-free'],
  avoid: ['Before/after skin claims', 'Competitor names'],
  format: '9:16 · 20–30 sec · captions on',
};

// The six checks AI Video Check runs, from the MVP scope.
export const VIDEO_CHECKS = [
  { label: 'Hook in the first 3 seconds', pass: true },
  { label: 'Product clearly on screen', pass: true },
  { label: 'Every must-say point said', pass: false, fix: 'Missing “absorbs fast”. Add it around 0:12.' },
  { label: 'Nothing from the avoid list', pass: true },
  { label: 'Vertical 9:16, 24 sec (brief: 20–30)', pass: true },
  { label: 'Clear speech, no long silences', pass: true },
];

export const MONEY = {
  eyebrow: 'Payment protection',
  title: 'How your money is protected',
  rail: ['Brand funds the project', 'Money is held', 'Draft passes the check', 'Brand approves', 'Creator is paid'],
  // The team must set every [bracketed] value before this ships.
  rules: [
    { title: 'Funded before work starts', body: 'The brand pays the agreed amount into a held balance with [payment partner] before the creator starts. Nobody shoots on a promise.' },
    { title: 'Checked before you see it', body: 'AI Video Check tests each draft against the brief. Only drafts that pass reach the brand.' },
    { title: 'Time to review', body: 'The brand has [X days] to approve or ask for up to [N revisions].' },
    { title: 'No ghosting, either side', body: 'If the brand doesn’t respond in [X days], the payment is released to the creator. If the creator misses [the deadline], the money goes back to the brand.' },
    { title: 'Disputes go to a person', body: 'Raise a dispute and our team reviews it within [48 hours], with a full or partial refund if the work missed the brief.' },
    { title: 'Paid out to UPI or bank', body: 'Approved payments reach the creator within [X working days]. Creators and editors keep 100% of their quoted rate.' },
  ],
  example: {
    title: 'Example: a ₹10,000 Reel',
    rows: [
      ['Creator’s rate', '₹10,000'],
      ['Fewsion fee, 10–15%, paid by the brand', '₹1,000–1,500'],
      ['Brand pays', '₹11,000–11,500'],
      ['Creator receives', '₹10,000'],
    ],
  },
  note: 'Payment protection is due in Q4 2026 and rolls out with our first campaigns. The final approval window and refund rules will be in our Terms before you make your first payment.',
};

export const ROLES = [
  {
    id: 'brands',
    tag: 'For D2C brands',
    title: 'Stop rewriting briefs on WhatsApp.',
    points: [
      'A full brief from a product link, ready to share',
      'Only see drafts that pass your checklist',
      'Pay when you approve, not before',
      'Start free and pay a fee only on paid projects',
    ],
    button: ROLE_BUTTONS.brand,
    card: { title: 'Draft ready for review', meta: 'Passed 6 of 6 checks', status: 'Ready' },
  },
  {
    id: 'creators',
    tag: 'For UGC creators',
    title: 'Know exactly what to shoot.',
    points: [
      'Clear briefs: hooks, shot list, must-says and don’ts',
      'A fix list before the brand sees your draft, so fewer revision rounds',
      'Budget held before you start',
      'Keep 100% of your quoted rate',
    ],
    button: ROLE_BUTTONS.creator,
    card: { title: 'New brief: Vitamin C serum', meta: '1 Reel · 9:16 · 20–30 sec', status: 'Budget held' },
  },
  {
    id: 'editors',
    tag: 'For video editors',
    status: STATUS.editorMarketplace,
    title: 'Get the spec, not a voice note.',
    points: [
      'Get hired by creators and brands for edits',
      'The brief’s format rules travel with the project: 9:16, length, hook, captions',
      'The same AI check before anything goes to the brand',
      'The same payment protection as creators',
    ],
    button: ROLE_BUTTONS.editor,
    card: { title: 'Edit request from a creator', meta: 'Cut to 25 sec · add captions', status: 'Invited' },
  },
];

// Mirrors app/pricing/page.tsx. Update both together.
export const PRICING = [
  {
    who: 'Brands',
    price: 'Free',
    unit: 'to start',
    lines: [
      '10–15% fee on each paid project, paid by you on top of the creator’s rate',
      'Brand Premium at ₹2,999/month adds the AI Brief Builder and performance tracking when they launch (Q1 2027)',
    ],
    featured: true,
  },
  {
    who: 'Creators',
    price: 'Free',
    unit: 'always',
    lines: ['Keep 100% of your quoted rate', 'Creator Pro at ₹499/month for priority placement and deeper analytics'],
  },
  {
    who: 'Editors',
    price: 'Free',
    unit: 'always',
    lines: ['Keep 100% of your quoted rate', 'Editor Pro at ₹299/month for priority ranking and project analytics'],
  },
];

export const FAQ = [
  {
    q: 'Is Fewsion live?',
    a: 'Early access is open. Creator profiles, campaign listings and AI matching are live today. Payment protection and the editor marketplace are due in Q4 2026, the AI Brief Builder in Q1 2027, and AI Video Check is in development. Every feature on this page is marked with its status.',
  },
  {
    q: 'What exactly does the AI check?',
    a: 'Six things, all taken from your brief: the hook lands in the first 3 seconds, the product is clearly on screen, every must-say point is said, nothing from the avoid list appears, the format is vertical 9:16 at the right length, and the speech is clear with no long silences.',
  },
  {
    q: 'What if the AI gets it wrong?',
    a: 'When the AI isn’t sure, it fails the draft and a person on our team takes a look. We’d rather a good video wait for a human check than let a bad one through to you.',
  },
  {
    q: 'Who pays the platform fee?',
    a: 'The brand. It’s 10–15% of each paid project, added on top of the creator’s rate. Creators and editors keep their full quoted amount.',
  },
  {
    q: 'Can I talk to a person?',
    a: 'Yes. WhatsApp or call us on [+91 XXXXX XXXXX], [Mon–Sat, 10am–7pm IST], or email founders@fewsion.in.',
  },
];

// Company identity from the Udyam registration certificate (28 Jul 2026).
// Phone, hours and GSTIN are placeholders for the team.
export const CONTACT = {
  whatsapp: '[+91 XXXXX XXXXX]',
  hours: '[Mon–Sat, 10am–7pm IST]',
  email: 'founders@fewsion.in',
  company: 'Fewsion',
  registration: 'Udyam-registered MSME · UDYAM-MH-20-0358186',
  gstin: 'GSTIN [to be added]',
  city: 'Nagpur, Maharashtra, India',
};

export const CTA = {
  title: 'Where brands meet creators.',
  sub: 'Bring a product link. Leave with a video you’d actually run.',
};

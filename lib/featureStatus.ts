// Single source of truth for what is live and what is not.
// Every "feature" claim on the site (landing, pricing, signup) reads from here,
// so a feature can never be sold as live while the roadmap says otherwise.
// When something ships, change its status here and every page updates.

export type FeatureStatus = 'live' | 'beta' | 'soon';

export interface FeatureInfo {
  status: FeatureStatus;
  /** Only for status "soon": the planned quarter, e.g. "Q4 2026" */
  when?: string;
}

export const FEATURES = {
  aiMatching: { status: 'live' },
  creatorScore: { status: 'beta' },
  // Matches the landing page (components/landing/content.ts): editor marketplace is due Q4 2026
  editorMarketplace: { status: 'soon', when: 'Q4 2026' },
  escrow: { status: 'soon', when: 'Q4 2026' },
  brandReviews: { status: 'soon', when: 'Q4 2026' },
  briefBuilder: { status: 'soon', when: 'Q1 2027' },
  contractGenerator: { status: 'soon', when: 'Q1 2027' },
  performanceTracker: { status: 'soon', when: 'Q1 2027' },
  creatorEditorCollab: { status: 'soon', when: 'Q1 2027' },
} as const satisfies Record<string, FeatureInfo>;

export type FeatureKey = keyof typeof FEATURES;

export function featureLabel(key: FeatureKey): string {
  const f: FeatureInfo = FEATURES[key];
  if (f.status === 'live') return 'Live';
  if (f.status === 'beta') return 'Beta';
  return f.when ? `Coming ${f.when}` : 'Coming soon';
}

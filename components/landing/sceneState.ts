// Shared, mutable state between the DOM scroll choreography (GSAP) and the
// WebGL scene (useFrame). Plain object on purpose: writing to it never
// triggers a React render, so scroll can drive the 3D at 60fps.

export type Tier = 'off' | 'lite' | 'full';

export const CHAPTERS = ['hero', 'problem', 'how', 'tools', 'money', 'roles', 'pricing', 'cta'] as const;
export type Chapter = (typeof CHAPTERS)[number];

export const sceneState = {
  /** Continuous chapter index: 2.5 = halfway through the "how" chapter. */
  story: 0,
  /** How-it-works progress, 0..4 (one unit per step). */
  step: 0,
  /** Which role card is centred in the roles chapter: 0 brand, 1 creator, 2 editor. */
  role: 0,
  /** Normalised pointer, -1..1 on both axes. */
  pointer: { x: 0, y: 0 },
  /** Extra spin added by dragging the hero knot (radians per second). */
  spinVelocity: 0,
};

/** Reads `?3d=off|lite|full` so the fallbacks can be checked on any device. */
function forcedTier(): Tier | null {
  const v = new URLSearchParams(window.location.search).get('3d');
  return v === 'off' || v === 'lite' || v === 'full' ? v : null;
}

/**
 * Decides how much 3D a device gets.
 * - off:  reduced motion, data saver, no WebGL2, a very weak device, or a phone
 *         that doesn't report clear headroom -> static poster and diagrams.
 * - lite: strong phones, tablets and mid-range laptops -> fewer particles, no post-processing.
 * - full: everything else.
 */
export function detectTier(): Tier {
  const forced = forcedTier();
  if (forced) return forced;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return 'off';

  // Phones skip ~250 KB of 3D on mobile data unless they say they can take it
  // (Chrome on Android reports memory and connection; Safari reports neither).
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse && Math.min(window.screen.width, window.screen.height) < 600) {
    const strong = (nav.deviceMemory ?? 0) >= 6 && (navigator.hardwareConcurrency ?? 0) >= 6;
    if (!strong || nav.connection?.effectiveType !== '4g') return 'off';
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return 'off';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return 'off';
  }

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  if (memory <= 2 || cores <= 2) return 'off';

  if (coarse || window.innerWidth < 900 || memory <= 4 || cores <= 4) return 'lite';
  return 'full';
}

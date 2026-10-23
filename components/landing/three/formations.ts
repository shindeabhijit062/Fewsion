// Particle "formations" the scene morphs between as you scroll. Every formation
// has the same number of points, so the shader can blend them per vertex.
//   0 nebula  - loose cloud (hero, problem, pricing)
//   1 rings   - orbit rings around the AI core (how it works, roles)
//   2 frame   - a 9:16 phone frame being scanned (AI Video Check)
//   3 shield  - a sphere shell around the core (payment protection)
//   4 halo    - a ring around the logo (final call to action)

export const FORMATION_COUNT = 5;

// Small deterministic PRNG so the layout is identical on every load.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildFormations(count: number) {
  const rnd = mulberry32(27);
  const nebula = new Float32Array(count * 3);
  const rings = new Float32Array(count * 3);
  const frame = new Float32Array(count * 3);
  const shield = new Float32Array(count * 3);
  const halo = new Float32Array(count * 3);
  const rand = new Float32Array(count * 3);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const shellCount = Math.floor(count * 0.72);

  for (let i = 0; i < count; i++) {
    const o = i * 3;
    rand[o] = rnd();
    rand[o + 1] = rnd();
    rand[o + 2] = rnd();

    // nebula: wide, flattened cloud, denser towards the middle
    {
      const u = rnd() * 2 - 1;
      const th = rnd() * Math.PI * 2;
      const r = 1.6 + Math.pow(rnd(), 0.65) * 7.5;
      const s = Math.sqrt(1 - u * u);
      nebula[o] = Math.cos(th) * s * r * 1.5;
      nebula[o + 1] = u * r * 0.7;
      nebula[o + 2] = Math.sin(th) * s * r * 0.8 - 1.5;
    }

    // rings: three orbits plus a dense glow around the core
    {
      const pick = rnd();
      if (pick < 0.18) {
        const u = rnd() * 2 - 1;
        const th = rnd() * Math.PI * 2;
        const r = 0.55 + rnd() * 0.5;
        const s = Math.sqrt(1 - u * u);
        rings[o] = Math.cos(th) * s * r;
        rings[o + 1] = u * r;
        rings[o + 2] = Math.sin(th) * s * r;
      } else {
        const ring = pick < 0.55 ? 1.9 : pick < 0.82 ? 2.7 : 3.6;
        const th = rnd() * Math.PI * 2;
        const jitter = (rnd() - 0.5) * (ring === 1.9 ? 0.08 : 0.22);
        rings[o] = Math.cos(th) * (ring + jitter);
        rings[o + 1] = Math.sin(th) * (ring + jitter);
        rings[o + 2] = (rnd() - 0.5) * 0.12;
      }
    }

    // frame: 9:16 outline, scanline rows inside, a little dust around it
    {
      const w = 2.1;
      const h = 3.75;
      const pick = rnd();
      if (pick < 0.42) {
        const t = rnd() * 2 * (w + h);
        let x: number;
        let y: number;
        if (t < w) { x = -w / 2 + t; y = h / 2; }
        else if (t < w + h) { x = w / 2; y = h / 2 - (t - w); }
        else if (t < 2 * w + h) { x = w / 2 - (t - w - h); y = -h / 2; }
        else { x = -w / 2; y = -h / 2 + (t - 2 * w - h); }
        frame[o] = x + (rnd() - 0.5) * 0.03;
        frame[o + 1] = y + (rnd() - 0.5) * 0.03;
        frame[o + 2] = (rnd() - 0.5) * 0.05;
      } else if (pick < 0.85) {
        const rows = 28;
        const row = Math.floor(rnd() * rows);
        frame[o] = (rnd() - 0.5) * (w - 0.18);
        frame[o + 1] = -h / 2 + 0.12 + (row / (rows - 1)) * (h - 0.24);
        frame[o + 2] = (rnd() - 0.5) * 0.04;
      } else {
        frame[o] = (rnd() - 0.5) * 7;
        frame[o + 1] = (rnd() - 0.5) * 5.5;
        frame[o + 2] = -1 - rnd() * 3;
      }
    }

    // shield: Fibonacci sphere shell plus latitude bands
    {
      if (i < shellCount) {
        const y = 1 - (i / (shellCount - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = golden * i;
        const R = 2.15;
        shield[o] = Math.cos(th) * r * R;
        shield[o + 1] = y * R;
        shield[o + 2] = Math.sin(th) * r * R;
      } else {
        const band = Math.floor(rnd() * 5) - 2;
        const lat = band * 0.42;
        const th = rnd() * Math.PI * 2;
        const R = 2.45;
        shield[o] = Math.cos(th) * Math.cos(lat) * R;
        shield[o + 1] = Math.sin(lat) * R;
        shield[o + 2] = Math.sin(th) * Math.cos(lat) * R;
      }
    }

    // halo: torus around the logo plus sparks thrown outward
    {
      const th = rnd() * Math.PI * 2;
      if (rnd() < 0.72) {
        const ph = rnd() * Math.PI * 2;
        const tube = 0.18 * Math.sqrt(rnd());
        const R = 2.05;
        halo[o] = (R + Math.cos(ph) * tube) * Math.cos(th);
        halo[o + 1] = (R + Math.cos(ph) * tube) * Math.sin(th);
        halo[o + 2] = Math.sin(ph) * tube;
      } else {
        const R = 2.3 + Math.pow(rnd(), 2) * 4;
        halo[o] = Math.cos(th) * R;
        halo[o + 1] = Math.sin(th) * R;
        halo[o + 2] = (rnd() - 0.5) * 1.5;
      }
    }
  }

  return { nebula, rings, frame, shield, halo, rand };
}

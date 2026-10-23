'use client';

import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { sceneState } from '../sceneState';
import { FORMATION_COUNT } from './formations';

// One keyframe per page chapter (see CHAPTERS in sceneState). The director
// blends between them as the page scrolls and publishes the result in `frame`,
// which every other scene object reads in its own useFrame.
type Key = {
  stage: [number, number, number]; // where the logo + network + particles sit
  logo: number; // logo scale
  spin: number; // 0 = logo faces the viewer, 1 = logo spins like a core
  form: [number, number, number, number, number]; // nebula, rings, frame, shield, halo
  turb: number; // particle turbulence
  net: number; // brand/creator/editor network visibility
  cam: [number, number, number];
  // Optional DOM slot ([data-anchor="..."]) the stage should sit in. When set,
  // x/y (and the logo or network size) follow that element on screen.
  anchor?: 'hero' | 'how' | 'cta';
  ns?: number; // network scale when not anchored
};

const f = (n: number): Key['form'] => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0, n === 3 ? 1 : 0, n === 4 ? 1 : 0];

const WIDE: Key[] = [
  { stage: [2.35, 0, 0], logo: 1.3, spin: 0, form: f(0), turb: 0.15, net: 0, cam: [0, 0, 9], anchor: 'hero' },
  { stage: [3.4, 1.9, -4], logo: 1.1, spin: 0.6, form: f(0), turb: 1, net: 0, cam: [0, 0.3, 9.5] }, // problem
  { stage: [2.45, -0.1, 0], logo: 0.5, spin: 1, form: f(1), turb: 0.1, net: 1, cam: [0, 0, 9], anchor: 'how' },
  { stage: [0, 0, -2.4], logo: 0, spin: 1, form: f(2), turb: 0.05, net: 0, cam: [0, 0, 9] }, // tools
  { stage: [-2.6, 0, 0], logo: 0.6, spin: 0.7, form: f(3), turb: 0.08, net: 0, cam: [0, 0.2, 9] }, // money
  { stage: [2.75, -0.1, 0], logo: 0.4, spin: 1, form: f(1), turb: 0.1, net: 1, cam: [0, 0.4, 8.6], ns: 0.85 }, // roles
  { stage: [0, 0, -3], logo: 0.8, spin: 0.5, form: f(0), turb: 0.3, net: 0, cam: [0, 0, 9] }, // pricing
  { stage: [0, 1.1, 0], logo: 0.8, spin: 0, form: f(4), turb: 0.1, net: 0, cam: [0, 0, 9], anchor: 'cta' },
];

const NARROW: Key[] = [
  { stage: [0, 1.25, 0], logo: 0.78, spin: 0, form: f(0), turb: 0.15, net: 0, cam: [0, 0, 10.5], anchor: 'hero' },
  { stage: [0, 2.6, -4], logo: 0.8, spin: 0.6, form: f(0), turb: 1, net: 0, cam: [0, 0.3, 11] },
  { stage: [0, 1.55, 0], logo: 0.4, spin: 1, form: f(1), turb: 0.1, net: 1, cam: [0, 0, 10.5], anchor: 'how' },
  { stage: [0, 0, -3], logo: 0, spin: 1, form: f(2), turb: 0.05, net: 0, cam: [0, 0, 10.5] },
  { stage: [0, 1.6, -1.5], logo: 0.45, spin: 0.7, form: f(3), turb: 0.08, net: 0, cam: [0, 0.2, 10.5] },
  { stage: [0, 2.0, -1.2], logo: 0.4, spin: 1, form: f(1), turb: 0.1, net: 1, cam: [0, 0.4, 10.5] },
  { stage: [0, 0, -3], logo: 0.7, spin: 0.5, form: f(0), turb: 0.3, net: 0, cam: [0, 0, 10.5] },
  { stage: [0, 1.15, 0], logo: 0.7, spin: 0, form: f(4), turb: 0.1, net: 0, cam: [0, 0, 10.5], anchor: 'cta' },
];

// Resolved key: anchors replaced by on-screen positions for this frame.
type Pose = { x: number; y: number; z: number; logo: number; netScale: number };
const anchors = new Map<string, Element | null>();
const GLYPH_HEIGHT = 2; // LOGO_SHAPES span y in [-1, 1]
const NETWORK_SPAN = 4.3; // ring diameter plus node labels, in world units

function resolve(k: Key, aspect: number, fov: number, narrow: boolean, out: Pose) {
  out.x = k.stage[0];
  out.y = k.stage[1];
  out.z = k.stage[2];
  out.logo = k.logo;
  out.netScale = (narrow ? 0.62 : 1) * (k.ns ?? 1);
  if (!k.anchor) return out;
  let el = anchors.get(k.anchor);
  if (el === undefined || (el && !el.isConnected)) {
    el = document.querySelector(`[data-anchor="${k.anchor}"]`);
    anchors.set(k.anchor, el);
  }
  if (!el) return out;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return out;
  // The camera looks at the origin, so a screen point maps linearly onto the z = 0 plane.
  const halfH = k.cam[2] * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const halfW = halfH * aspect;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  out.x = ((r.left + r.width / 2) / vw) * 2 * halfW - halfW;
  out.y = halfH - ((r.top + r.height / 2) / vh) * 2 * halfH;
  const slotW = (r.width / vw) * 2 * halfW;
  const slotH = (r.height / vh) * 2 * halfH;
  const fit = Math.min(slotW, slotH);
  if (k.net > 0) {
    out.netScale = THREE.MathUtils.clamp(fit / NETWORK_SPAN, 0.4, 1.15);
    out.logo = k.logo * out.netScale;
  } else {
    out.logo = (Math.min(slotW / 0.87, slotH) * 0.82) / GLYPH_HEIGHT;
  }
  return out;
}
const poseA: Pose = { x: 0, y: 0, z: 0, logo: 1, netScale: 1 };
const poseB: Pose = { x: 0, y: 0, z: 0, logo: 1, netScale: 1 };

// Stream ids: 0 brand->core, 1 core->creator, 2 creator->core, 3 core->brand, 4 creator->editor, 5 core->editor
const STEP_STREAMS = [
  [1, 0.55, 0, 0, 0, 0], // 01 brief from a product link
  [0, 1, 0, 0, 0.9, 0.5], // 02 pick a creator (and an editor)
  [0, 0, 1, 0.85, 0.3, 0], // 03 draft checked against the brief
  [0.85, 1, 0, 0, 0, 0.6], // 04 approve and pay
];
const ROLE_STREAMS = [
  [1, 0, 0, 1, 0, 0], // brand
  [0, 1, 1, 0, 0.8, 0], // creator
  [0, 0, 0, 0, 1, 1], // editor
];
const NODE_ANGLES = [Math.PI / 2, (7 * Math.PI) / 6, (11 * Math.PI) / 6]; // brand, creator, editor

export const frame = {
  stage: new THREE.Vector3(),
  logoScale: 1,
  spin: 0,
  form: new Array<number>(FORMATION_COUNT).fill(0),
  turb: 0,
  net: 0,
  netScale: 1,
  streams: new Array<number>(6).fill(0),
  money: 0,
  orbit: 0, // rotation of the network ring
  narrow: false,
};

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = THREE.MathUtils.lerp;

const camTarget = new THREE.Vector3();
const lookAt = new THREE.Vector3();
let story = 0;
let step = 0;
let orbit = 0;

export default function Director() {
  const camera = useThree((s) => s.camera);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const narrow = state.size.width / state.size.height < 0.85;
    const keys = narrow ? NARROW : WIDE;

    // Damped follow so scroll jumps still read as camera moves, not cuts.
    story = lerp(story, sceneState.story, 1 - Math.exp(-dt * 3.2));
    step = lerp(step, sceneState.step, 1 - Math.exp(-dt * 4));

    // Hold each chapter's key through most of the section and blend around the
    // boundary (from 0.35 before the next section reaches mid-screen to 0.15 after).
    const t = story + 0.35;
    const i = Math.max(0, Math.min(keys.length - 1, Math.floor(t)));
    const e = smooth(clamp01((t - i) / 0.5));
    const a = keys[Math.max(0, i - 1)];
    const b = keys[i];
    const aspect = state.size.width / state.size.height;
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const pa = resolve(a, aspect, fov, narrow, poseA);
    const pb = resolve(b, aspect, fov, narrow, poseB);

    frame.narrow = narrow;
    frame.stage.set(lerp(pa.x, pb.x, e), lerp(pa.y, pb.y, e), lerp(pa.z, pb.z, e));
    frame.logoScale = lerp(pa.logo, pb.logo, e);
    frame.spin = lerp(a.spin, b.spin, e);
    for (let k = 0; k < FORMATION_COUNT; k++) frame.form[k] = lerp(a.form[k], b.form[k], e);
    frame.turb = lerp(a.turb, b.turb, e);
    frame.net = lerp(a.net, b.net, e);
    frame.netScale = lerp(pa.netScale, pb.netScale, e);

    // Streams: follow the how-it-works step inside chapter 2, the focused role in chapter 5.
    const s0 = Math.min(3, Math.floor(step));
    const s1 = Math.min(3, s0 + 1);
    const sf = smooth(clamp01((step - s0 - 0.5) * 2));
    const inHow = 1 - clamp01(Math.abs(story - 2.5) - 0.6);
    const role = Math.min(2, Math.max(0, sceneState.role));
    for (let k = 0; k < 6; k++) {
      const how = lerp(STEP_STREAMS[s0][k], STEP_STREAMS[s1][k], sf);
      frame.streams[k] = lerp(ROLE_STREAMS[role][k], how, inHow) * frame.net;
    }
    frame.money = clamp01(step - 2.6) * inHow;

    // Ring orbit: drifts slowly while explaining, turns the focused role to the front in chapter 5.
    const inRoles = 1 - clamp01(Math.abs(story - 5.5) - 0.6);
    const front = -Math.PI / 2 - NODE_ANGLES[role];
    const drift = orbit + dt * 0.12;
    const nearest = front + Math.round((drift - front) / (Math.PI * 2)) * Math.PI * 2;
    orbit = lerp(drift, lerp(drift, nearest, 1 - Math.exp(-dt * 3)), inRoles);
    frame.orbit = orbit;

    // Camera: chapter key plus a little pointer parallax.
    const px = sceneState.pointer.x;
    const py = sceneState.pointer.y;
    camTarget.set(lerp(a.cam[0], b.cam[0], e) + px * 0.35, lerp(a.cam[1], b.cam[1], e) + py * 0.22, lerp(a.cam[2], b.cam[2], e));
    camera.position.lerp(camTarget, 1 - Math.exp(-dt * 2.5));
    camera.lookAt(lookAt);
  }, -1);

  return null;
}

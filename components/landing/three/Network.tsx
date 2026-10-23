'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { frame } from './Director';

// The three sides of Fewsion orbit the logo ("AI core"). Packets of light flow
// along the streams that matter for the current how-it-works step or role.
const RADIUS = 1.9;
const NODES = [
  { label: 'Brands', angle: Math.PI / 2, color: '#ff7a1a' },
  { label: 'Creators', angle: (7 * Math.PI) / 6, color: '#ffb547' },
  { label: 'Editors', angle: (11 * Math.PI) / 6, color: '#ffe9d2' },
].map((n) => ({ ...n, pos: new THREE.Vector3(Math.cos(n.angle) * RADIUS, Math.sin(n.angle) * RADIUS, 0) }));

const CORE = new THREE.Vector3(0, 0, 0);
const [BRAND, CREATOR, EDITOR] = NODES.map((n) => n.pos);
// Same order as the stream ids in Director.
const STREAMS: [THREE.Vector3, THREE.Vector3][] = [
  [BRAND, CORE],
  [CORE, CREATOR],
  [CREATOR, CORE],
  [CORE, BRAND],
  [CREATOR, EDITOR],
  [CORE, EDITOR],
];
const PACKETS_PER_STREAM = 34;

function control(a: THREE.Vector3, b: THREE.Vector3, k: number) {
  // Lift the mid point out of the ring plane so streams arc; alternate the side per stream.
  return a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, k % 2 === 0 ? 0.75 : -0.55));
}

const packetVertex = /* glsl */ `
  uniform float uTime;
  uniform float uActive[6];
  uniform float uPixelRatio;
  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute float aT;
  attribute float aStream;
  varying float vAlpha;
  void main() {
    float t = fract(aT + uTime * 0.28);
    vec3 p = mix(mix(aP0, aP1, t), mix(aP1, aP2, t), t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float act = uActive[int(aStream + 0.5)];
    float edge = smoothstep(0.0, 0.12, t) * smoothstep(1.0, 0.85, t);
    gl_PointSize = (30.0 + 40.0 * act) * uPixelRatio / -mv.z;
    vAlpha = act * edge;
  }
`;

const packetFragment = /* glsl */ `
  uniform float uMoney;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.86, 0.45), uMoney);
    gl_FragColor = vec4(pow(col, vec3(2.2)) * (1.0 + a), a * a * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function Network({ dpr }: { dpr: number }) {
  const outer = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const curves = useMemo(
    () => STREAMS.map(([a, b], k) => new THREE.QuadraticBezierCurve3(a.clone(), control(a, b, k), b.clone())),
    []
  );

  const lines = useMemo(
    () =>
      curves.map((c) => {
        const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(48));
        const m = new THREE.LineBasicMaterial({ color: '#ff9a4a', transparent: true, opacity: 0, depthWrite: false });
        return new THREE.Line(g, m);
      }),
    [curves]
  );

  const packets = useMemo(() => {
    const n = STREAMS.length * PACKETS_PER_STREAM;
    const p0 = new Float32Array(n * 3);
    const p1 = new Float32Array(n * 3);
    const p2 = new Float32Array(n * 3);
    const t = new Float32Array(n);
    const stream = new Float32Array(n);
    curves.forEach((c, k) => {
      for (let i = 0; i < PACKETS_PER_STREAM; i++) {
        const j = k * PACKETS_PER_STREAM + i;
        c.v0.toArray(p0, j * 3);
        c.v1.toArray(p1, j * 3);
        c.v2.toArray(p2, j * 3);
        t[j] = i / PACKETS_PER_STREAM + Math.random() * 0.02;
        stream[j] = k;
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p0, 3));
    g.setAttribute('aP0', new THREE.BufferAttribute(p0, 3));
    g.setAttribute('aP1', new THREE.BufferAttribute(p1, 3));
    g.setAttribute('aP2', new THREE.BufferAttribute(p2, 3));
    g.setAttribute('aT', new THREE.BufferAttribute(t, 1));
    g.setAttribute('aStream', new THREE.BufferAttribute(stream, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: packetVertex,
      fragmentShader: packetFragment,
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: new Array(6).fill(0) },
        uPixelRatio: { value: dpr },
        uMoney: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    return pts;
  }, [curves, dpr]);

  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.2, 0), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.34, 0.012, 8, 64), []);
  const nodeMats = useMemo(
    () =>
      NODES.map(
        (n) =>
          new THREE.MeshStandardMaterial({
            color: '#141a46',
            emissive: n.color,
            emissiveIntensity: 0.35,
            roughness: 0.2,
            metalness: 0.3,
            flatShading: true,
            transparent: true,
          })
      ),
    []
  );
  const ringMats = useMemo(
    () => NODES.map((n) => new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0 })),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const vis = frame.net;
    const o = outer.current;
    if (!o) return;
    o.visible = vis > 0.01;
    o.position.lerp(frame.stage, 1 - Math.exp(-dt * 5));
    o.scale.setScalar(frame.netScale * (0.85 + 0.15 * vis));
    if (ring.current) ring.current.rotation.z = frame.orbit;

    const u = (packets.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = time;
    u.uMoney.value = frame.money;
    for (let k = 0; k < 6; k++) {
      u.uActive.value[k] = frame.streams[k];
      (lines[k].material as THREE.LineBasicMaterial).opacity = vis * (0.08 + frame.streams[k] * 0.35);
    }

    // A node glows when any stream touching it is busy.
    const busy = [
      Math.max(frame.streams[0], frame.streams[3]),
      Math.max(frame.streams[1], frame.streams[2], frame.streams[4]),
      Math.max(frame.streams[4], frame.streams[5]),
    ];
    NODES.forEach((_, k) => {
      const g = nodeRefs.current[k];
      if (g) {
        const s = 0.85 + busy[k] * 0.45 + Math.sin(time * 2 + k) * 0.04;
        g.scale.setScalar(s);
        g.rotation.x = time * 0.4 + k;
        g.rotation.y = time * 0.3;
      }
      nodeMats[k].opacity = vis;
      nodeMats[k].emissiveIntensity = 0.3 + busy[k] * 1.1;
      ringMats[k].opacity = vis * (0.25 + busy[k] * 0.6);
      const label = labelRefs.current[k];
      if (label) {
        label.style.opacity = String(vis * (0.55 + busy[k] * 0.45));
        label.style.visibility = vis > 0.02 ? 'visible' : 'hidden';
      }
    });
  });

  return (
    <group ref={outer}>
      <group rotation={[-1.05, 0, 0]}>
        <group ref={ring}>
          {lines.map((l, k) => (
            <primitive key={k} object={l} />
          ))}
          <primitive object={packets} />
          {NODES.map((n, k) => (
            <group key={n.label} position={n.pos}>
              <group ref={(el) => { nodeRefs.current[k] = el; }}>
                <mesh geometry={nodeGeo} material={nodeMats[k]} />
              </group>
              <mesh geometry={ringGeo} material={ringMats[k]} />
              <Html zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
                <div ref={(el) => { labelRefs.current[k] = el; }} className="fx-node-label" style={{ opacity: 0, visibility: 'hidden' }}>
                  <span style={{ background: n.color }} />
                  {n.label}
                </div>
              </Html>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

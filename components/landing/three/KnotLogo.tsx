'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mergeGeometries, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LOGO_SHAPES } from './logoShape';
import { sceneState, type Tier } from '../sceneState';
import { frame } from './Director';

// Each traced ribbon gets its own depth so the weave reads as layered when the
// knot turns. Order follows LOGO_SHAPES.
const PIECE_DEPTH = [0.05, -0.04, 0.07, -0.02, 0.03, -0.06];

function buildKnotGeometry(tier: Tier) {
  const pieces = LOGO_SHAPES.map((s, i) => {
    const shape = new THREE.Shape(s.outer.map(([x, y]) => new THREE.Vector2(x, y)));
    s.holes.forEach((h) => shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y)))));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.032,
      bevelOffset: -0.032, // bevel inward so the gaps of the weave stay open
      bevelSegments: tier === 'full' ? 6 : 3,
    });
    geo.translate(0, 0, PIECE_DEPTH[i % PIECE_DEPTH.length] - 0.1);
    return geo;
  });
  const merged = mergeGeometries(pieces);
  pieces.forEach((p) => p.dispose());
  merged.computeBoundingBox();
  const c = new THREE.Vector3();
  merged.boundingBox!.getCenter(c);
  merged.translate(-c.x, -c.y, -c.z);
  // Smooth the bevel but keep the crisp edge where it meets the face.
  return toCreasedNormals(merged, Math.PI / 5);
}

export default function KnotLogo({ tier }: { tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => buildKnotGeometry(tier), [tier]);
  // Glossy amber, like the brand's 3D renders.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ff8a2e',
        emissive: '#ff4a00',
        emissiveIntensity: 0.55,
        roughness: 0.14,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.4,
      }),
    []
  );
  const angle = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;

    // Dragging adds spin; it bleeds off, then the knot settles back to face you.
    sceneState.spinVelocity *= Math.exp(-dt * 1.6);
    angle.current += dt * (sceneState.spinVelocity + 0.55 * frame.spin);
    if (frame.spin < 0.5 && Math.abs(sceneState.spinVelocity) < 0.25) {
      const rest = Math.round(angle.current / (Math.PI * 2)) * Math.PI * 2;
      angle.current = THREE.MathUtils.lerp(angle.current, rest, 1 - Math.exp(-dt * 1.8));
    }

    const idle = 1 - frame.spin;
    g.position.lerp(frame.stage, 1 - Math.exp(-dt * 5));
    g.position.y += Math.sin(time * 0.8) * 0.04 * idle;
    const s = THREE.MathUtils.lerp(g.scale.x, frame.logoScale, 1 - Math.exp(-dt * 5));
    g.scale.setScalar(s);
    g.rotation.y = angle.current + sceneState.pointer.x * 0.45 * idle + Math.sin(time * 0.45) * 0.18 * idle;
    g.rotation.x = -sceneState.pointer.y * 0.3 * idle + Math.sin(time * 0.6) * 0.06;
    g.rotation.z = Math.sin(time * 0.3) * 0.04;

    // Breathe a little brighter while the knot is the "AI core".
    material.emissiveIntensity = 0.55 + frame.spin * (0.25 + Math.sin(time * 2.4) * 0.12);
    if (mesh.current) mesh.current.visible = s > 0.02;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

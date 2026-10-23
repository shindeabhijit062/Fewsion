'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { frame } from './Director';

// Out-of-focus dust floating between the camera and the logo, like a shallow
// depth-of-field shot. It lives in camera depth (not on the stage), drifts
// upward slowly and slides with scroll, nearer flakes moving more.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uCamZ;
  uniform float uTanHalf;
  uniform float uAspect;
  uniform float uScale;
  uniform float uPixelRatio;
  uniform float uVis;
  attribute vec2 aBase;
  attribute float aDepth;
  attribute vec3 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float halfH = aDepth * uTanHalf * 1.2;
    float halfW = halfH * uAspect;
    // Float upward and wrap; scrolling pushes nearer flakes further.
    float y = fract(aBase.y * 0.5 + 0.5 + uTime * (0.003 + aRand.x * 0.005) + uScroll * 0.3 / aDepth) * 2.0 - 1.0;
    float x = aBase.x + sin(uTime * (0.15 + aRand.y * 0.2) + aRand.z * 6.2831) * 0.05;
    vec3 pos = vec3(x * halfW, y * halfH * 1.1, uCamZ - aDepth);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Closer flakes are bigger and blurrier; a few are huge and faint.
    float size = (140.0 + aRand.z * aRand.z * 200.0) / aDepth * uScale;
    gl_PointSize = min(size, 160.0) * uPixelRatio;

    vec3 orange = vec3(1.0, 0.5, 0.16);
    vec3 peach = vec3(1.0, 0.8, 0.6);
    vec3 cream = vec3(1.0, 0.94, 0.86);
    vColor = mix(mix(orange, peach, aRand.x), cream, step(0.8, aRand.y) * 0.7);
    float breathe = 0.75 + 0.25 * sin(uTime * (0.4 + aRand.y * 0.5) + aRand.x * 12.0);
    // Fade in near the top and bottom of the wrap so flakes never pop.
    float edge = smoothstep(1.0, 0.8, abs(y));
    // No flakes over the nav and headline at the top of the screen.
    edge *= 1.0 - smoothstep(0.05, 0.55, y);
    // Bigger flakes are fainter, so the energy spreads like a real out-of-focus light.
    vAlpha = (0.035 + aRand.x * 0.05) * mix(1.0, 0.5, aRand.z) * breathe * edge * uVis;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // A soft lens-bokeh disc: flat body, faint brighter rim, wide feathered edge.
    float disc = 1.0 - smoothstep(0.45, 1.0, d);
    float rim = smoothstep(0.55, 0.85, d) * (1.0 - smoothstep(0.85, 1.0, d));
    float a = disc * 0.8 + rim * 0.18;
    gl_FragColor = vec4(pow(vColor, vec3(2.2)), a * vAlpha);
    #include <colorspace_fragment>
  }
`;

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

export default function Bokeh({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const points = useMemo(() => {
    const rnd = mulberry32(91);
    const base = new Float32Array(count * 2);
    const depth = new Float32Array(count);
    const rand = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Keep the headline column clear: most flakes sit on the logo side,
      // the rest hug the far left edge.
      base[i * 2] = rnd() < 0.7 ? 0.5 + rnd() * 0.5 : -1 + rnd() * 0.2;
      base[i * 2 + 1] = rnd() * 2 - 1;
      // Bias towards the camera so most flakes are big and soft.
      depth[i] = 2.4 + Math.pow(rnd(), 0.8) * 4.0;
      rand[i * 3] = rnd();
      rand[i * 3 + 1] = rnd();
      rand[i * 3 + 2] = rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aBase', new THREE.BufferAttribute(base, 2));
    g.setAttribute('aDepth', new THREE.BufferAttribute(depth, 1));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 3));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uCamZ: { value: 9 },
        uTanHalf: { value: Math.tan(THREE.MathUtils.degToRad(17.5)) },
        uAspect: { value: 1.6 },
        uScale: { value: 1 },
        uPixelRatio: { value: dpr },
        uVis: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const p = new THREE.Points(g, m);
    p.frustumCulled = false;
    p.renderOrder = 10;
    return p;
  }, [count, dpr]);

  useFrame((state) => {
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    const cam = state.camera as THREE.PerspectiveCamera;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = frame.story;
    u.uCamZ.value = cam.position.z;
    u.uTanHalf.value = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    u.uAspect.value = state.size.width / state.size.height;
    u.uScale.value = state.size.height / 900;
    // Thin the dust while the network diagram is on screen so it stays legible.
    u.uVis.value = 1 - 0.45 * frame.net;
  });

  return <primitive object={points} />;
}

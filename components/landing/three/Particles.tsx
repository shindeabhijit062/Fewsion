'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { buildFormations } from './formations';
import { frame } from './Director';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uW[5];
  uniform float uTurb;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFocus;
  attribute vec3 aNebula;
  attribute vec3 aRings;
  attribute vec3 aFrame;
  attribute vec3 aShield;
  attribute vec3 aHalo;
  attribute vec3 aRand;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBlur;

  vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }
  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

  void main() {
    // Each formation keeps its own slow motion, then they are blended.
    vec3 rings = rotX(rotZ(aRings, uTime * (0.08 + aRand.y * 0.12)), -1.05);
    vec3 shield = rotY(aShield, uTime * 0.18);
    vec3 halo = rotZ(aHalo, uTime * 0.1);
    vec3 nebula = rotY(aNebula, uTime * 0.015);
    vec3 p = nebula * uW[0] + rings * uW[1] + aFrame * uW[2] + shield * uW[3] + halo * uW[4];

    float t = uTime * 0.35 + aRand.x * 6.2831;
    p += vec3(sin(t + p.y * 0.8), cos(t * 0.9 + p.x * 0.7), sin(t * 1.1 + p.z)) * (0.03 + uTurb * 0.4) * (0.4 + aRand.y);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Depth of field around the logo: points behind the focus plane shrink and
    // fade out (fewer distant "stars"), points in front of it grow soft.
    float dist = -mv.z;
    float far = smoothstep(uFocus + 0.3, uFocus + 4.0, dist);
    vBlur = smoothstep(uFocus - 2.4, uFocus - 5.5, dist);
    float size = uSize * (0.35 + aRand.z * 1.15) * (1.0 - 0.55 * far);
    gl_PointSize = (size / dist + vBlur * (4.0 + aRand.z * 8.0)) * uPixelRatio;

    // A scan line sweeps the phone frame (AI Video Check).
    float scanY = mod(uTime * 1.1, 4.6) - 2.3;
    float scan = smoothstep(0.22, 0.0, abs(aFrame.y - scanY)) * uW[2];

    vec3 orange = vec3(1.0, 0.45, 0.08);
    vec3 peach = vec3(1.0, 0.85, 0.68);
    vec3 cool = vec3(0.55, 0.62, 1.0);
    vColor = mix(orange, peach, aRand.x * aRand.x);
    vColor = mix(vColor, cool, step(0.93, aRand.y) * 0.8);
    vColor += scan * vec3(0.6, 0.5, 0.3);
    float twinkle = 0.8 + 0.2 * sin(uTime * 1.7 + aRand.y * 40.0);
    vAlpha = (0.55 + aRand.z * 0.75) * (1.0 + scan * 2.0) * twinkle;
    vAlpha *= (1.0 - 0.9 * far) * mix(1.0, 0.2, vBlur);

    // Keep the nav, headline and dark background clean: the loose cloud thins
    // out towards the top of the screen and behind the text column.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float top = smoothstep(0.15, 0.75, ndc.y);
    float textSide = smoothstep(0.1, -0.45, ndc.x);
    vAlpha *= 1.0 - uW[0] * (0.92 * top + 0.5 * textSide * (1.0 - top));
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // In focus: a tight glowing dot. Out of focus: a flat, soft-edged disc.
    float glow = 1.0 - smoothstep(0.0, 1.0, d);
    float disc = 1.0 - smoothstep(0.6, 1.0, d);
    float a = mix(glow * glow, disc, vBlur);
    gl_FragColor = vec4(pow(vColor, vec3(2.2)), a * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const f = buildFormations(count);
    const g = new THREE.BufferGeometry();
    // `position` is only used for bounds; the shader builds the real position.
    g.setAttribute('position', new THREE.BufferAttribute(f.nebula, 3));
    g.setAttribute('aNebula', new THREE.BufferAttribute(f.nebula, 3));
    g.setAttribute('aRings', new THREE.BufferAttribute(f.rings, 3));
    g.setAttribute('aFrame', new THREE.BufferAttribute(f.frame, 3));
    g.setAttribute('aShield', new THREE.BufferAttribute(f.shield, 3));
    g.setAttribute('aHalo', new THREE.BufferAttribute(f.halo, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(f.rand, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uW: { value: [1, 0, 0, 0, 0] },
          uTurb: { value: 0 },
          uSize: { value: 30 },
          uPixelRatio: { value: 1 },
          uFocus: { value: 9 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    u.uW.value = frame.form;
    u.uTurb.value = frame.turb;
    const p = points.current;
    if (p) {
      // Particles trail the stage a little behind the logo for parallax.
      p.position.lerp(frame.stage, 1 - Math.exp(-Math.min(delta, 0.05) * 2.2));
      // Rings follow the network size, the halo hugs the logo.
      const sc = 1 + (frame.netScale - 1) * frame.form[1] + (frame.logoScale - 1) * frame.form[4];
      p.scale.setScalar(THREE.MathUtils.lerp(p.scale.x, sc, 0.08));
      // Focus on the logo wherever the stage is.
      u.uFocus.value = state.camera.position.distanceTo(p.position);
    }
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Director from './Director';
import KnotLogo from './KnotLogo';
import Particles from './Particles';
import Network from './Network';
import Bokeh from './Bokeh';
import type { Tier } from '../sceneState';

// Stops rendering while an opaque section fully covers the canvas.
function PauseWhenCovered() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const onCovered = (e: Event) => setFrameloop((e as CustomEvent<boolean>).detail ? 'never' : 'always');
    window.addEventListener('fx:covered', onCovered);
    return () => window.removeEventListener('fx:covered', onCovered);
  }, [setFrameloop]);
  return null;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // Two frames in: the first real frame has been presented.
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

export default function Experience({ tier, onReady }: { tier: Exclude<Tier, 'off'>; onReady: () => void }) {
  const full = tier === 'full';
  const [dpr, setDpr] = useState(full ? 1.75 : 1.35);
  const [effects, setEffects] = useState(full);

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: !full, powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => {
          setEffects(false);
          setDpr(1);
        }}
      />
      <PauseWhenCovered />
      <ReadySignal onReady={onReady} />
      <Director />
      <color attach="background" args={['#000000']} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff1e0" position={[0, 4, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={2.2} color="#ff9a3c" position={[-5, 0, 2]} scale={[2, 7, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} color="#ffe2c4" position={[5, -1, 1]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[2, 2, 5]} scale={1.5} />
      </Environment>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#fff3e6" />

      <KnotLogo tier={tier} />
      <Network dpr={dpr} />
      <Particles count={full ? 6500 : 2800} />
      <Bokeh count={full ? 14 : 6} />

      {effects && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.5} luminanceSmoothing={0.25} radius={0.75} />
          <Vignette offset={0.28} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

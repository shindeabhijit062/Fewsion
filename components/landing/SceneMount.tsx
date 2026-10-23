'use client';

import { Component, useCallback, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { detectTier, type Tier } from './sceneState';

// three.js and friends only load on devices that get 3D, after the page is idle.
const Experience = dynamic(() => import('./three/Experience'), { ssr: false, loading: () => null });

// If WebGL fails mid-way (driver bug, lost context), keep the static poster.
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneMount() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = detectTier();
    const root = document.documentElement;
    root.dataset.fx3d = t;
    if (t === 'off') return;

    // Loading three.js and compiling shaders blocks the main thread for a
    // moment, so wait until the hero text intro has finished (or 2.5s at most),
    // then start when the browser is idle. The poster covers the wait.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let cancelled = false;
    let idle = 0;
    const intro = Array.from(document.querySelectorAll('.fx-hero .fx-word__in, .fx-hero .fx-intro')).flatMap((el) =>
      el.getAnimations()
    );
    const cap = new Promise((resolve) => setTimeout(resolve, 2500));
    Promise.race([Promise.all(intro.map((a) => a.finished.catch(() => undefined))), cap]).then(() => {
      if (cancelled) return;
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setTier(t), { timeout: 800 });
      else setTier(t);
    });
    return () => {
      cancelled = true;
      if (idle) w.cancelIdleCallback?.(idle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute('data-fx3d-ready', ready);
  }, [ready]);

  const onReady = useCallback(() => {
    performance.mark('fx:3d-ready');
    setReady(true);
  }, []);
  const onError = useCallback(() => {
    setReady(false);
    document.documentElement.dataset.fx3d = 'off';
  }, []);

  if (!tier || tier === 'off') return null;
  return (
    <div className="fx-stage" aria-hidden="true">
      <SceneBoundary onError={onError}>
        <Experience tier={tier} onReady={onReady} />
      </SceneBoundary>
    </div>
  );
}

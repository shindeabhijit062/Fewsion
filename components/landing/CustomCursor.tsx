'use client';

import { useEffect, useRef } from 'react';

// Branded cursor for mouse users: an orange dot that tracks the pointer exactly
// and a ring that follows with a slight lag. The ring grows over links and
// buttons and becomes a "Drag" handle over the 3D knot. Touch devices,
// reduced-motion users and text fields keep the system cursor.
const INTERACTIVE = 'a, button, summary, [role="button"], label, select, [data-knot-grab]';
const TEXT = 'input, textarea, [contenteditable="true"]';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const d = dot.current;
    const r = ring.current;
    if (!fine || reduced || !d || !r) return;

    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let shown = false;
    let raf = 0;

    const setState = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const state = !el ? '' : el.closest(TEXT) ? 'text' : el.closest('[data-knot-grab]') ? 'drag' : el.closest(INTERACTIVE) ? 'link' : '';
      if (r.dataset.state !== state) {
        r.dataset.state = state;
        d.dataset.state = state;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        root.setAttribute('data-fx-cursor-on', '');
      }
      setState(e.target);
    };
    const onLeave = () => {
      shown = false;
      root.removeAttribute('data-fx-cursor-on');
    };
    const onDown = () => r.setAttribute('data-pressed', '');
    const onUp = () => r.removeAttribute('data-pressed');

    const loop = () => {
      // Ease the ring towards the pointer; skip work once it has caught up.
      const dx = x - rx;
      const dy = y - ry;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rx += dx * 0.2;
        ry += dy * 0.2;
        r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      root.removeAttribute('data-fx-cursor-on');
    };
  }, []);

  return (
    <div className="fx-cursor" aria-hidden="true">
      <div ref={ring} className="fx-cursor__ring">
        <div className="fx-cursor__circle" />
        <span className="fx-cursor__label">Drag</span>
      </div>
      <div ref={dot} className="fx-cursor__dot" />
    </div>
  );
}

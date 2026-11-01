'use client';

import { useEffect } from 'react';

// Pointer-driven polish for mouse users, all from one delegated pointermove
// listener batched into requestAnimationFrame:
// - magnetic buttons lean towards the cursor (--mag-x / --mag-y)
// - cards get a spotlight that follows the cursor (--sx / --sy)
// - hero headline letters lift and glow near the cursor (--f per letter)
// - the footer wordmark fills with orange around the cursor (--wx / --wy)
// Touch devices and reduced-motion users get none of it.
const MAGNETIC = '.fx-btn, [data-magnetic]';
const SPOTLIGHT = '.fx-card, .fx-plan, .fx-compare__panel, [data-spotlight]';
const LETTER_RADIUS = 160;
const LETTER_REACH = 120; // px around the headline where letters start reacting

export default function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    root.setAttribute('data-fx-hover', '');

    const title = document.querySelector<HTMLElement>('[data-letters]');
    const letters = title ? Array.from(title.querySelectorAll<HTMLElement>('.fx-ch')) : [];
    const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');

    let centers: { x: number; y: number }[] = [];
    let lettersActive = false;
    let lettersReady = false;

    // The words are clipped for the intro reveal; once it has played, unclip
    // them so lifted letters and their glow aren't cut off.
    if (title) {
      const intro = title.getAnimations({ subtree: true });
      Promise.all(intro.map((a) => a.finished.catch(() => undefined))).then(() => {
        title.setAttribute('data-ready', '');
        lettersReady = true;
      });
    }
    let magnet: HTMLElement | null = null;
    let magnetBase: DOMRect | null = null;
    let spot: HTMLElement | null = null;
    let last: PointerEvent | null = null;
    let raf = 0;

    const measureLetters = () => {
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const resetLetters = () => {
      letters.forEach((el) => el.style.setProperty('--f', '0'));
      lettersActive = false;
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.setProperty('--mag-x', '0px');
      magnet.style.setProperty('--mag-y', '0px');
      magnet = null;
      magnetBase = null;
    };

    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      // Magnetic buttons: measure once on entry so the lean doesn't feed back.
      const m = target?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (m !== magnet) {
        releaseMagnet();
        if (m) {
          magnet = m;
          magnetBase = m.getBoundingClientRect();
        }
      }
      if (magnet && magnetBase) {
        const dx = e.clientX - (magnetBase.left + magnetBase.width / 2);
        const dy = e.clientY - (magnetBase.top + magnetBase.height / 2);
        magnet.style.setProperty('--mag-x', `${(dx * 0.3).toFixed(1)}px`);
        magnet.style.setProperty('--mag-y', `${(dy * 0.4).toFixed(1)}px`);
      }

      // Spotlight cards.
      const s = target?.closest<HTMLElement>(SPOTLIGHT) ?? null;
      if (s !== spot) spot = s;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--sx', `${(e.clientX - r.left).toFixed(0)}px`);
        spot.style.setProperty('--sy', `${(e.clientY - r.top).toFixed(0)}px`);
      }

      // Hero letters.
      if (title && letters.length && lettersReady) {
        const tr = title.getBoundingClientRect();
        const near =
          e.clientX > tr.left - LETTER_REACH &&
          e.clientX < tr.right + LETTER_REACH &&
          e.clientY > tr.top - LETTER_REACH &&
          e.clientY < tr.bottom + LETTER_REACH;
        if (near) {
          if (!lettersActive) {
            measureLetters();
            lettersActive = true;
          }
          letters.forEach((el, i) => {
            const c = centers[i];
            const d = Math.hypot(e.clientX - c.x, e.clientY - c.y);
            const f = Math.max(0, 1 - d / LETTER_RADIUS);
            el.style.setProperty('--f', (f * f).toFixed(3));
          });
        } else if (lettersActive) {
          resetLetters();
        }
      }

      // Footer wordmark.
      if (wordmark) {
        const r = wordmark.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        wordmark.toggleAttribute('data-lit', inside);
        if (inside) {
          wordmark.style.setProperty('--wx', `${(e.clientX - r.left).toFixed(0)}px`);
          wordmark.style.setProperty('--wy', `${(e.clientY - r.top).toFixed(0)}px`);
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      releaseMagnet();
      resetLetters();
      wordmark?.removeAttribute('data-lit');
    };
    // Layout moves under a still pointer when scrolling; re-measure next time.
    const onScroll = () => {
      if (lettersActive) resetLetters();
      if (magnet) releaseMagnet();
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      onLeave();
      root.removeAttribute('data-fx-hover');
    };
  }, []);

  return null;
}

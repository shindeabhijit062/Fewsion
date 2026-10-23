'use client';

import { useEffect } from 'react';
import { CHAPTERS, sceneState } from './sceneState';

// Wires scroll to everything that moves: the 3D scene (through sceneState),
// the pinned how-it-works steps, reveals, the problem marquee, the floating UI
// cards and smooth scrolling. GSAP and Lenis are imported lazily so they never
// block the first paint. With reduced motion only the step/role tracking runs.
export default function Choreography() {
  useEffect(() => {
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    // CSS keys the pinned/collapsed layouts off this, so without JS or with
    // reduced motion every step and rail stage is simply shown.
    const root = document.documentElement;
    if (!reduced) {
      root.setAttribute('data-fx-motion', '');
      cleanups.push(() => root.removeAttribute('data-fx-motion'));
    }

    const onPointer = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduced) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener('pointermove', onPointer));
    }

    // Drag the hero knot to spin it.
    const grab = document.querySelector<HTMLElement>('[data-knot-grab]');
    if (grab && !reduced) {
      let lastX = 0;
      let lastT = 0;
      let dragging = false;
      const down = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastT = performance.now();
        grab.setPointerCapture(e.pointerId);
        grab.dataset.dragging = '';
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const now = performance.now();
        const v = (e.clientX - lastX) / Math.max(8, now - lastT);
        sceneState.spinVelocity = Math.max(-14, Math.min(14, sceneState.spinVelocity * 0.6 + v * 6));
        lastX = e.clientX;
        lastT = now;
      };
      const up = () => {
        dragging = false;
        delete grab.dataset.dragging;
      };
      grab.addEventListener('pointerdown', down);
      grab.addEventListener('pointermove', move);
      grab.addEventListener('pointerup', up);
      grab.addEventListener('pointercancel', up);
      cleanups.push(() => {
        grab.removeEventListener('pointerdown', down);
        grab.removeEventListener('pointermove', move);
        grab.removeEventListener('pointerup', up);
        grab.removeEventListener('pointercancel', up);
      });
    }

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {});
      cleanups.push(() => ctx.revert());

      // Smooth scrolling on desktop pointers only; touch scrolling stays native.
      if (!reduced && fine) {
        const { default: Lenis } = await import('lenis');
        if (cancelled) return;
        const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const onAnchor = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!a) return;
          const target = a.getAttribute('href');
          if (!target || target === '#') return;
          const el = document.querySelector(target);
          if (!el) return;
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.4 });
          history.replaceState(null, '', target);
        };
        document.addEventListener('click', onAnchor);
        cleanups.push(() => {
          document.removeEventListener('click', onAnchor);
          gsap.ticker.remove(tick);
          lenis.destroy();
        });
      }

      ctx.add(() => {
        // Chapters -> continuous story value for the 3D director.
        CHAPTERS.forEach((name, i) => {
          const el = document.querySelector(`[data-chapter="${name}"]`);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
              if (self.isActive) sceneState.story = i + self.progress;
            },
            onToggle: (self) => {
              if (self.isActive) sceneState.story = i + self.progress;
            },
          });
        });

        // Pinned steps: each step gets an equal share of the scroll distance.
        const how = document.querySelector<HTMLElement>('[data-how]');
        if (how) {
          const items = Array.from(how.querySelectorAll<HTMLElement>('[data-step]'));
          let active = -1;
          ScrollTrigger.create({
            trigger: how,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              const p = self.progress;
              sceneState.step = Math.min(items.length - 0.001, p * items.length);
              how.style.setProperty('--how-p', p.toFixed(4));
              const idx = Math.min(items.length - 1, Math.floor(p * items.length));
              if (idx !== active) {
                active = idx;
                items.forEach((it, k) => it.toggleAttribute('data-active', k === idx));
              }
            },
          });
        }

        // Roles: the centred card decides which node the camera turns to.
        document.querySelectorAll<HTMLElement>('[data-role-card]').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
              if (self.isActive) sceneState.role = i;
            },
          });
        });

        // Pause WebGL while the opaque pricing block covers the whole screen.
        document.querySelectorAll<HTMLElement>('[data-opaque]').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            onToggle: (self) => window.dispatchEvent(new CustomEvent('fx:covered', { detail: self.isActive })),
          });
        });

        if (reduced) return;

        // Reveals.
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 44,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            delay: Number(el.dataset.reveal || 0) * 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        // Problem marquee rows slide in opposite directions with the scroll.
        gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((row, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          gsap.fromTo(
            row,
            { xPercent: dir < 0 ? 0 : -28 },
            {
              xPercent: dir < 0 ? -28 : 0,
              ease: 'none',
              scrollTrigger: { trigger: row.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            }
          );
        });

        // Floating UI cards drift at different depths.
        gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el) => {
          const depth = Number(el.dataset.float || 1);
          gsap.fromTo(
            el,
            { y: 60 * depth },
            { y: -60 * depth, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }
          );
        });

        // Brief Builder: the URL types itself, then the brief assembles.
        const brief = document.querySelector<HTMLElement>('[data-brief]');
        if (brief) {
          const url = brief.querySelector<HTMLElement>('[data-brief-url]');
          const parts = brief.querySelectorAll('[data-brief-part]');
          const tl = gsap.timeline({ scrollTrigger: { trigger: brief, start: 'top 75%', once: true } });
          if (url) tl.from(url, { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'steps(28)' });
          tl.from(brief.querySelector('[data-brief-btn]'), { scale: 0.9, opacity: 0.4, duration: 0.3 }, '-=0.1');
          tl.from(parts, { y: 18, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.12 }, '+=0.15');
        }

        // Video Check: checks tick one by one, then the verdict lands.
        const check = document.querySelector<HTMLElement>('[data-check]');
        if (check) {
          const rows = check.querySelectorAll('[data-check-row]');
          const tl = gsap.timeline({ scrollTrigger: { trigger: check, start: 'top 75%', once: true } });
          tl.from(rows, { x: -14, opacity: 0, duration: 0.45, ease: 'power3.out', stagger: 0.22 });
          tl.from(check.querySelectorAll('[data-check-fix]'), { height: 0, opacity: 0, duration: 0.4 }, '-=0.6');
          tl.from(check.querySelector('[data-check-verdict]'), { y: 16, opacity: 0, duration: 0.6, ease: 'back.out(2)' });
        }

        // Money rail fills with scroll.
        const rail = document.querySelector<HTMLElement>('[data-rail]');
        if (rail) {
          const nodes = Array.from(rail.querySelectorAll<HTMLElement>('[data-rail-node]'));
          ScrollTrigger.create({
            trigger: rail,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
            onUpdate: (self) => {
              rail.style.setProperty('--rail-p', self.progress.toFixed(3));
              nodes.forEach((n, k) => n.toggleAttribute('data-lit', self.progress >= k / (nodes.length - 1) - 0.02));
            },
          });
        }

        // Cards tilt towards the pointer.
        if (fine) {
          gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((el) => {
            const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
            const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
            gsap.set(el, { transformPerspective: 900 });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 10);
              rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
            cleanups.push(() => {
              el.removeEventListener('pointermove', move);
              el.removeEventListener('pointerleave', leave);
            });
          });
        }
      });

      // Fonts and images can shift layout after load; re-measure once.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
      cleanups.push(() => window.removeEventListener('load', refresh));
    })();

    return () => {
      cancelled = true;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, []);

  return null;
}

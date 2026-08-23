/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: 'var(--black)',
        deep: 'var(--deep)',
        card: 'var(--card)',
        card2: 'var(--card2)',
        amber: {
          DEFAULT: 'var(--amber)',
          '2': 'var(--amber2)',
        },
        green: {
          fewsion: 'var(--green)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
          dim: 'var(--muted2)',
        },
        border: {
          DEFAULT: 'var(--border)',
          '2': 'var(--border2)',
        },
        foreground: 'var(--text)',
        background: 'var(--black)',
        secondary: 'var(--card2)',
      },
      fontFamily: {
        display: ['Syne', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'clamp-h1': 'clamp(36px, 5vw, 68px)',
        'clamp-h2': 'clamp(28px, 4vw, 52px)',
        'clamp-h3': 'clamp(22px, 3vw, 40px)',
      },
      letterSpacing: {
        tightest: '-2px',
        tighter: '-1.5px',
        tight: '-0.8px',
      },
      boxShadow: {
        glow: '0 12px 40px rgba(245, 166, 35, 0.35)',
        'glow-sm': '0 8px 24px rgba(245, 166, 35, 0.25)',
        hero: '0 40px 80px rgba(0, 0, 0, 0.6)',
        card: '0 10px 40px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'gradient-amber': 'linear-gradient(135deg, #F5A623 0%, #FF6B35 100%)',
        'gradient-page': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%)',
        'gradient-grid': 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
      keyframes: {
        // Orbit animation for hero graphic
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Core glow pulse
        coreGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,166,35,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(245,166,35,0.7)' },
        },
        // Scroll-driven dash flow on SVG lines
        dashFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        // Shimmer text animation
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        // Fade + slide up for page reveal
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Hero reveal
        heroReveal: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Ping pulse for live badge
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        // Subtle float up-down
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Spinner
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Slide up in
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Toast show
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
        // Password strength bar fill
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width, 100%)' },
        },
        // Accordion open
        accordionOpen: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '500px' },
        },
        // Roadmap pulse dot
        roadmapDot: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(245,166,35,0.4)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 0 8px rgba(245,166,35,0)' },
        },
        // Border beam
        borderBeam: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        orbit: 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 15s linear infinite reverse',
        coreGlow: 'coreGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        fadeUp: 'fadeUp 0.6s ease forwards',
        heroReveal: 'heroReveal 0.8s ease forwards',
        float: 'float 4s ease-in-out infinite',
        ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        spin: 'spin 0.6s linear infinite',
        slideUp: 'slideUp 0.4s ease forwards',
        toastIn: 'toastIn 0.3s ease forwards',
        roadmapDot: 'roadmapDot 2s ease-in-out infinite',
        borderBeam: 'borderBeam 3s ease infinite',
        'dash-flow': 'dashFlow 3s linear infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};

import { JetBrains_Mono } from 'next/font/google';
import './landing.css';
import './interactions.css';
import LandingNav from './LandingNav';
import SceneMount from './SceneMount';
import Choreography from './Choreography';
import CustomCursor from './CustomCursor';
import Interactions from './Interactions';
import AIChatbotWidget from '@/components/AIChatbotWidget';
import {
  BusinessModel,
  Competitors,
  Features,
  FinalCta,
  Hero,
  LandingFooter,
  Market,
  Problem,
  Solution,
  Vision,
} from './Sections';

// Monospace for section labels and numbers; self-hosted by next/font.
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--fx-mono', display: 'swap' });

// The marketing home page. Copy renders on the server so text paints first;
// the WebGL scene (SceneMount) and scroll choreography load after hydration.
// Section order follows the original home page; each one carries a 3D chapter
// (data-chapter) in the same order as CHAPTERS in sceneState.
export default function Landing() {
  return (
    <div className={`fx-root ${mono.variable}`}>
      <a href="#main" className="fx-skip">
        Skip to content
      </a>
      <LandingNav />
      <SceneMount />
      <main id="main" className="fx-main">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Market />
        <Competitors />
        <BusinessModel />
        <Vision />
        <FinalCta />
      </main>
      <LandingFooter />
      <Choreography />
      <CustomCursor />
      <Interactions />
      <AIChatbotWidget />
    </div>
  );
}

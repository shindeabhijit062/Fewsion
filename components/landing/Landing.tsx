import './landing.css';
import LandingNav from './LandingNav';
import SceneMount from './SceneMount';
import Choreography from './Choreography';
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

// The marketing home page. Copy renders on the server so text paints first;
// the WebGL scene (SceneMount) and scroll choreography load after hydration.
// Section order follows the original home page; each one carries a 3D chapter
// (data-chapter) in the same order as CHAPTERS in sceneState.
export default function Landing() {
  return (
    <div className="fx-root">
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
      <AIChatbotWidget />
    </div>
  );
}

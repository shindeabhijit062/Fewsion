import './landing.css';
import LandingNav from './LandingNav';
import SceneMount from './SceneMount';
import Choreography from './Choreography';
import { AiTools, FinalCta, Hero, HowItWorks, LandingFooter, Money, Pricing, Problem, Roles } from './Sections';

// The marketing home page. Copy renders on the server so text paints first;
// the WebGL scene (SceneMount) and scroll choreography load after hydration.
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
        <HowItWorks />
        <AiTools />
        <Money />
        <Roles />
        <Pricing />
        <FinalCta />
      </main>
      <LandingFooter />
      <Choreography />
    </div>
  );
}

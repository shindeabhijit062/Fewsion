import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AiMatchDemo } from './components/AiMatchDemo';
import { CreatorsDirectory } from './components/CreatorsDirectory';
import { Features } from './components/Features';
import { StatsSection } from './components/StatsSection';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { AuthModal, CreatorModal } from './components/Modals';
import { BriefBuilder } from './components/BriefBuilder';
import { CursorAura, LiveOpsFeed, ScrollProgress } from './components/Effects';
import { Creator } from './data/mockData';

export function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStartedPlan = (_planName: string) => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500 selection:text-black">
      <ScrollProgress />
      <CursorAura />
      
      {/* Header / Navbar */}
      <Navbar 
        onOpenAuth={handleOpenAuth}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section (Matching Reference Design) */}
        <Hero 
          onExploreClick={() => handleNavigate('creators')}
          onAiMatchClick={() => handleNavigate('aimatch')}
        />

        {/* Stats Bar */}
        <StatsSection />

        {/* AI Match Studio & Live Demo */}
        <AiMatchDemo 
          onSelectCreator={(creator) => setSelectedCreator(creator)}
        />

        {/* Functional AI Campaign Brief Builder */}
        <BriefBuilder
          onSelectCreator={(creator) => setSelectedCreator(creator)}
        />

        {/* Creators & Editors Directory */}
        <CreatorsDirectory 
          onSelectCreator={(creator) => setSelectedCreator(creator)}
        />

        {/* Platform Features */}
        <Features />

        {/* Success Stories & Testimonials */}
        <Testimonials />

        {/* Pricing Tiers */}
        <Pricing 
          onGetStarted={handleGetStartedPlan}
        />

        {/* Frequently Asked Questions */}
        <Faq />
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      <LiveOpsFeed onNavigate={handleNavigate} />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <CreatorModal 
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />

    </div>
  );
}

export default App;

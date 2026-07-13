import {
  BusinessIntelligence,
  Capabilities,
  DemoSelector,
  FinalCta,
  GoodJourney,
  Hero,
  JourneyLie,
  LocalScenes,
  Navbar,
} from "@/components/AidohExperience";

const Index = () => {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--electric)] selection:text-[#07100d]">
      {/* @section: page-orchestration */}
      <Navbar />
      <Hero />
      <JourneyLie />
      <LocalScenes />
      <GoodJourney />
      <Capabilities />
      <DemoSelector />
      <BusinessIntelligence />
      <FinalCta />
    </main>
  );
};

export default Index;

import {
  AudienceFilter,
  BusinessIntelligence,
  Capabilities,
  DemoSelector,
  Differentiation,
  EconomicCost,
  FinalCta,
  FutureLayer,
  GoodJourney,
  Hero,
  JourneyLie,
  LocalScenes,
  Navbar,
  Pricing,
  WorkProcess,
} from "@/components/AidohExperience";

const Index = () => {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--electric)] selection:text-[#07100d]">
      {/* @section: page-orchestration */}
      <Navbar />
      <Hero />
      <EconomicCost />
      <JourneyLie />
      <WorkProcess />
      <LocalScenes />
      <GoodJourney />
      <Capabilities />
      <DemoSelector />
      <BusinessIntelligence />
      <Differentiation />
      <AudienceFilter />
      <Pricing />
      <FutureLayer />
      <FinalCta />
    </main>
  );
};

export default Index;

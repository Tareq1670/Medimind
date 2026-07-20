"use client";

import { useAuthSession } from "@/hooks/useAuthSession";
import {
  HeroSlider,
  QuickToolsGrid,
  HowItWorks,
  FeaturedMedicines,
  AIEngineSpotlight,
  ClinicalPlatformIntelligence,
  DoctorRoster,
  Testimonials,
  BlogPreview,
  SymptomChecker,
  NewsletterSignup,
} from "@/components/home";

export default function Home() {
  const { isAuthenticated, isPending } = useAuthSession();

  return (
    <div className="flex flex-col">
      <HeroSlider isAuthenticated={isAuthenticated} isLoading={isPending} />
      <QuickToolsGrid />
      <HowItWorks />
      <FeaturedMedicines />
      <AIEngineSpotlight />
      <ClinicalPlatformIntelligence />
      <DoctorRoster />
      <Testimonials />
      <BlogPreview />
      <SymptomChecker />
      <NewsletterSignup />
    </div>
  );
}

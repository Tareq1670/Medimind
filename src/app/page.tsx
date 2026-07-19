"use client";

import { useAuthSession } from "@/hooks/useAuthSession";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { QuickToolsGrid } from "@/components/landing/QuickToolsGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedMedicines } from "@/components/landing/FeaturedMedicines";
import { AIEngineSpotlight } from "@/components/landing/AIEngineSpotlight";
import { ClinicalPlatformIntelligence } from "@/components/landing/ClinicalPlatformIntelligence";
import { DoctorRoster } from "@/components/landing/DoctorRoster";
import { Testimonials } from "@/components/landing/Testimonials";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { SymptomChecker } from "@/components/landing/SymptomChecker";
import { NewsletterSignup } from "@/components/landing/NewsletterSignup";

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

"use client";

import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedStartups from "@/components/home/FeaturedStartups";
import FeaturedOpportunities from "@/components/home/FeaturedOpportunities";
import WhyJoinSection from "@/components/home/WhyJoinSection";
import SuccessStories from "@/components/home/SuccessStories";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedStartups />
      <FeaturedOpportunities />
      <WhyJoinSection />
      <SuccessStories />
      <CTASection />
    </>
  );
}

"use client";

import HeroSection from "./HeroSection";
import OsSection from "./OsSection";
import YsSection from "./YsSection";
import PostSection from "./PostSection";
import BannerSection from "./BannerSection";
import ServiceSection from "./ServiceSection";

import "../styles/MainContainer.scss";
import { useVisitor } from "@/hooks/useVisitor";

export default function MainContainer() {
  const { isLoading: fpIsLoading, error: fpError, data: visitorData } = useVisitor({ extendedResult: false }, { immediate: false });
  return (
    <div className="main">
      <HeroSection />
      <YsSection />
      <OsSection />
      <PostSection />
      <ServiceSection />
      <BannerSection/>
    </div>
  );
}
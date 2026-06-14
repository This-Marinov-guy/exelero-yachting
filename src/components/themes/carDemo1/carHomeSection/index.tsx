import React from "react";
import HomeHeroSection from "./HomeHeroSection";
import HomeOwnershipCTA from "./HomeOwnershipCTA";
import HomeBrandsSection from "./HomeBrandsSection";
import HomeWhoWeAre from "./HomeWhoWeAre";
import HomeStatsBanner from "./HomeStatsBanner";
import HomeBoatPreview from "./HomeBoatPreview";

const CarHomeSection = () => {
  return (
    <>
      <HomeHeroSection />
      {/* <HomeOwnershipCTA /> */}
      <HomeBrandsSection />
      <HomeWhoWeAre />
      <HomeStatsBanner />
      <HomeBoatPreview />
    </>
  );
};

export default CarHomeSection;
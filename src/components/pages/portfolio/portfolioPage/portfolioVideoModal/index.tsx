"use client";
import VideoModal from "@/components/commonComponents/modal/VideoModal";
import Portfolio from "@/components/commonComponents/portfolio";

const PortfolioVideoModalContainer = () => {
  return (
    <>
      <Portfolio gridSize={3} cardShow={9} type='video' sectionClass='portfolio-video' />
      <VideoModal />
    </>
  );
};

export default PortfolioVideoModalContainer;

"use client";
import { ImagePath } from "@/constants";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";

const PortfolioParallaxContainer = () => {
  return (
    <div className='portfolio-section p-0'>
      {dynamicNumber(5).map((item, i) => {
        return (
          <div className='portfolio-parallax-image' key={i}>
            <RatioImage src={`${ImagePath}/portfolio/full-img/${item}.jpg`} alt='portfolio-image1' className='bg-img' />
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioParallaxContainer;

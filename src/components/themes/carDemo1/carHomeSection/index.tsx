import React from "react";
import CarHomeFilter from "./filterSection";
import SliderBanner from "./SliderBanner";

const CarHomeSection = () => {
  return (
    <div className='car-home-section' id="carHome">
      <SliderBanner />
      <CarHomeFilter />    
    </div>
  );
};

export default CarHomeSection;

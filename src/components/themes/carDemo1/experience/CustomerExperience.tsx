import { ImagePath } from "@/constants";
import { ExperienceData } from "@/data/demo/demo1";
import RatioImage from "@/utils/RatioImage";
import React from "react";
import { Row } from "reactstrap";

const CustomerExperience = () => {
  return (
    <Row className='align-items-center g-4'>
      {ExperienceData.map((column, colIndex) => (
        <div key={colIndex} className={`col-lg-${colIndex === 1 ? "6 d-lg-block d-none p-0" : "3 col-sm-6 p-lg-0"}`}>
          {column.map((item, index) =>
            "image" in item ? (
              <div className='center-car-circle' key={index}>
                <RatioImage src={`${ImagePath}/car/round.png`} alt='' className='img-fluid' />
                <div className='second-car-circle'>
                  <div className='inner-car-circle'>
                    <RatioImage src={`${ImagePath}/car/experience.png`} alt='experience' className='img-fluid' data-aos='zoom-in' />
                  </div>
                </div>
              </div>
            ) : (
              <div className='service-box' key={index}>
                <div className='service-icon'>{item.icon}</div>
                <div className='service-content'>
                  <p>We provide free consultation to help you find a tenant for your new house.</p>
                </div>
              </div>
            )
          )}
        </div>
      ))}
    </Row>
  );
};

export default CustomerExperience;

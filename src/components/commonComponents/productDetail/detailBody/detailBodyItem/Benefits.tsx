import { BenefitsTitle, SVGPath } from "@/constants";
import { BenefitsData } from "@/data/job";
import Image from "next/image";
import React from "react";

const Benefits = () => {
  return (
    <div className='description-box'>
      <h5 className='description-title'>{BenefitsTitle}:</h5>
      <ul className='features-list'>
        {BenefitsData.map((item,i) => (
            <li key={i}>
              <div className="featured-icon">
                <Image height={30} width={30} src={`${SVGPath}/job/job-detail/${i+1}.svg`} alt={`j-${i+1}`} />
              </div>
              <h5>{item}</h5>
            </li>
          )
        )}        
      </ul>
    </div>
  );
};

export default Benefits;

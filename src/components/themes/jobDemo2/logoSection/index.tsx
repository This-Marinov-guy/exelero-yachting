import { ImagePath } from "@/constants";
import { dynamicNumber } from "@/utils";
import Image from "next/image";
import React, { Fragment } from "react";

const LogoSection = () => {
  
  return (
    <section className='dark-logo-section'>
      <h3>Top businesses in the world are recruiting on hire up</h3>
      <div className='quote'>
        <ul className='marquee'>
          {dynamicNumber(3).map((_, index) => {
            return (
              <Fragment key={index}>
                {dynamicNumber(10).map((image, i) => {
                  return (
                    <li key={i}>
                      <div className='logo-size'>
                        <Image width={200} height={60} src={`${ImagePath}/job/logo/${image}.png`} alt={`logo-${image}`} className='img-fluid' />
                      </div>
                    </li>
                  );
                })}
              </Fragment>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default LogoSection;
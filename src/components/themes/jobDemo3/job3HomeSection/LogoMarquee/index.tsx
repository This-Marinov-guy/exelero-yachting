import { SVGPath } from "@/constants";
import { JobCategoriesScrollData } from "@/data/demo/jobDemo3";
import Image from "next/image";
import { useEffect } from "react";

const LogoMarquee = () => {
  useEffect(() => {
    const handleScroll = () => {
      const translateAngle = window.pageYOffset * 0.15;
      const translateObjectsRight = document.querySelectorAll(".scroll-quote .marquee");
      const translateObjectsLeft = document.querySelectorAll(".reverse-quote .marquee");
      translateObjectsRight.forEach((object) => ((object as HTMLElement).style.transform = `translateX(${translateAngle}px)`));
      translateObjectsLeft.forEach((object) => ((object as HTMLElement).style.transform = `translateX(-${translateAngle}px)`));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      {JobCategoriesScrollData.map((item, i) => {
        return (
          <div className={`${item.class}`} key={i}>
            <ul className='marquee'>
              {item.scrollData.map((svg, i) => {
                return (
                  <li className="marquee-pill" key={i}>
                    <Image height={24} width={24} src={`${SVGPath}/job/category/${svg.image}.svg`} alt='j-cat-1' className='img-fluid' />
                    <h6>{svg.title}</h6>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default LogoMarquee;

"use client";
import { ImagePath } from "@/constants";
import { ModernPortfolio } from "@/data/pages/Portfolio";
import { PortfolioModernType } from "@/types/Portfolio";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { Container } from "reactstrap";

const PortfolioModernContainer = () => {
  const [hoveredImageStyle, setHoveredImageStyle] = useState<PortfolioModernType>({ left: 0, top: 0, index: null });

  const handleMouseMove = (e: MouseEvent<HTMLLIElement>, index: number) => {
    const rect = (e.currentTarget as HTMLLIElement).getBoundingClientRect();
    const offsetX = 350;
    const offsetY = 0;
    setHoveredImageStyle({
      left: e.clientX - rect.left + offsetX,
      top: e.clientY - rect.top + offsetY,
      index,
    });
  };

  const handleMouseLeave = () => setHoveredImageStyle({ left: 0, top: 0, index: null });

  return (
    <div className='creative-bg-img h-auto overflow-hidden'>
      <RatioImage src={`${ImagePath}/car/bg-effect/service-bg.png`} alt='service-bg' className='img-fluid bg-img' />
      <Container>
        <ul className='creative-portfolio-list'>
          {ModernPortfolio.map((item, i) => (
            <li key={i} onMouseMove={(e) => handleMouseMove(e, i)} onMouseLeave={handleMouseLeave} style={{ position: "relative" }}>
              <Link href={RouteList.Pages.Portfolio.Detail.PortfolioDetail1} className='portfolio-link'>
                {item.title}
              </Link>
              {hoveredImageStyle.index === i && (
                <div
                  className='full-img'
                  style={{
                    position: "absolute",
                    left: `${hoveredImageStyle.left}px`,
                    top: `${hoveredImageStyle.top}px`,
                    zIndex: 10,
                  }}
                >
                  <RatioImage src={`${ImagePath}/${item.imageSrc}`} alt={item.imageAlt} className='img-fluid' />
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};

export default PortfolioModernContainer;

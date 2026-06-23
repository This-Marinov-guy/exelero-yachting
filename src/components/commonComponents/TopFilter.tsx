"use client";

import Image from "next/image";
import { Container } from "reactstrap";
import ParticleComponent from "./ParticleComponent";

type TopFilterProps = {
  title?: string;
  description?: string;
};

const TopFilter = ({ title, description }: TopFilterProps = {}) => {
  return (
    <div className='breadcrumbs-section top-filter-section'>
      <div className="top-filter-background">
        <Image
          src="/assets/images/hero/main2.png"
          alt="Exelero Yachting"
          fill
          className="top-filter-bg-image"
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="top-filter-overlay"></div>
      </div>
      <Container>
        <div className='breadcrumbs-main'>
          {title && <h1 className="top-filter-title">{title}</h1>}
          {description && <p className="top-filter-description">{description}</p>}
        </div>
      </Container>
      <ParticleComponent />
    </div>
  );
};

export default TopFilter;

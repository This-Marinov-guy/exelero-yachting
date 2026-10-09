"use client";

import Image from "next/image";
import { Container } from "reactstrap";

type TopFilterProps = {
  title?: string;
  description?: string;
  image?: string | null;
  imageAlt?: string;
};

const TopFilter = ({ title, description, image = "/assets/images/hero/main2.png", imageAlt = "Exelero Yachting" }: TopFilterProps = {}) => {
  return (
    <div className={`breadcrumbs-section top-filter-section${image ? "" : " top-filter-section--plain"}`}>
      {image && (
        <div className="top-filter-background">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="top-filter-bg-image"
            priority
            style={{ objectFit: "cover" }}
          />
          <div className="top-filter-overlay"></div>
        </div>
      )}
      <Container>
        <div className='breadcrumbs-main'>
          {title && <h1 className="top-filter-title">{title}</h1>}
          {description && <p className="top-filter-description">{description}</p>}
        </div>
      </Container>
    </div>
  );
};

export default TopFilter;

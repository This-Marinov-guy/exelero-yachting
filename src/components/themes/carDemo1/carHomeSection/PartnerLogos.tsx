"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Partners } from "@/data/partners";

const PartnerLogos = () => {
  const partnerList = Object.values(Partners);

  return (
    <>
      {/* Desktop: Vertical line on the left */}
      <div className="partner-logos partner-logos--desktop">
        <div className="partner-logos__container">
          {partnerList.map((partner) => (
            <Link
              key={partner.id}
              href={partner.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-logos__item"
              title={partner.name}
            >
              <div className="partner-logos__image-wrapper">
                <Image
                  src={partner.logoImage}
                  alt={partner.name}
                  fill
                  className="partner-logos__image"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: Horizontal above header */}
      <div className="partner-logos partner-logos--mobile">
        <div className="partner-logos__container">
          {partnerList.map((partner) => (
            <Link
              key={partner.id}
              href={partner.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-logos__item"
              title={partner.name}
            >
              <div className="partner-logos__image-wrapper">
                <Image
                  src={partner.logoImage}
                  alt={partner.name}
                  fill
                  className="partner-logos__image"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default PartnerLogos;

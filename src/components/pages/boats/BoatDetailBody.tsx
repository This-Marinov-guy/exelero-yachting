"use client";

import { FC, useState, useEffect } from "react";
import { ProductType } from "@/types/Product";
import { Row, Col, Modal, ModalBody } from "reactstrap";
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "photoswipe/dist/photoswipe.css";

interface BoatDetailBodyProps {
  boat: ProductType;
}

const BoatDetailBody: FC<BoatDetailBodyProps> = ({ boat }) => {
  const [imgDimensions, setImgDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const mediaItems = boat.media?.length
    ? boat.media
    : (boat.image || []).map((url) => ({ url, type: "image" as const }));

  useEffect(() => {
    boat.image?.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        setImgDimensions((prev) => ({
          ...prev,
          [index]: { width: img.naturalWidth, height: img.naturalHeight },
        }));
      };
      img.src = src;
    });
  }, [boat.image]);

  const sanitizeHTML = (html: string): string => {
    if (!html || typeof html !== "string") return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span", "div"],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class", "color"],
    });
  };

  // Conversion functions
  const metersToFeet = (meters: number): number => Math.round(meters * 3.28084 * 10) / 10;
  const kgToLbs = (kg: number): number => Math.round(kg * 2.20462);
  const litersToGallons = (liters: number): number => Math.round(liters * 0.264172 * 10) / 10;
  const kwToHp = (kw: number): number => Math.round(kw * 1.34102 * 10) / 10;

  const formatDualUnit = (metricValue: number | undefined | null, metricUnit: string, converter: (val: number) => number, imperialUnit: string): string | null => {
    if (!metricValue) return null;
    const imperialValue = converter(metricValue);
    return `${metricValue}${metricUnit} (${imperialValue}${imperialUnit})`;
  };

  const specs: { label: string; value: string | null | undefined }[] = [
    { label: "Manufacturer",      value: boat.manufacturer || null },
    { label: "Build Number",      value: boat.buildNumber || null },
    { label: "Build Year",        value: boat.buildYear || null },
    { label: "Keel Type",         value: boat.keelType || null },
    { label: "CE Design Category", value: boat.ceDesignCategory || null },
    { label: "Material",          value: boat.material || null },
    { label: "Hull Length",       value: formatDualUnit(boat.hullLength,       "m",  metersToFeet,    "ft")  },
    { label: "Waterline Length",  value: formatDualUnit(boat.waterlineLength,  "m",  metersToFeet,    "ft")  },
    { label: "Beam",              value: formatDualUnit(boat.beam,             "m",  metersToFeet,    "ft")  },
    { label: "Draft",             value: formatDualUnit(boat.draft,            "m",  metersToFeet,    "ft")  },
    { label: "Ballast",           value: formatDualUnit(boat.ballast,          "kg", kgToLbs,         "lbs") },
    { label: "Displacement",      value: formatDualUnit(boat.displacement,     "kg", kgToLbs,         "lbs") },
    { label: "Engine Power",      value: formatDualUnit(boat.enginePower,      "kW", kwToHp,          "hp")  },
    { label: "Fuel Tank",         value: formatDualUnit(boat.fuelTank,         "L",  litersToGallons, "gal") },
    { label: "Water Tank",        value: formatDualUnit(boat.waterTank,        "L",  litersToGallons, "gal") },
  ].filter((s) => s.value);

  return (
    <div className="detail-body">
      {/* Image Gallery Carousel */}
      {mediaItems.length > 0 && (
        <div id="gallery" className="mb-5">
          <h4 className="detail-page-title mb-3">Gallery</h4>
          <Gallery>
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="boat-gallery-carousel"
            >
              {mediaItems.map((media, index) => (
                <SwiperSlide key={`${media.url}-${index}`}>
                  {media.type === "video" ? (
                    <div
                      className="boat-gallery-item"
                      onClick={() => setPreviewVideo(media.url)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setPreviewVideo(media.url);
                        }
                      }}
                    >
                      <video
                        src={media.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="boat-gallery-image"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div className="boat-gallery-overlay">
                        <i className="ri-play-circle-line" />
                      </div>
                    </div>
                  ) : (
                    <Item
                      original={media.url}
                      thumbnail={media.url}
                      width={imgDimensions[index]?.width ?? 1200}
                      height={imgDimensions[index]?.height ?? 800}
                    >
                      {({ ref, open }) => (
                      <div
                        ref={ref}
                        className="boat-gallery-item"
                        onClick={open}
                      >
                        <Image
                          src={media.url}
                          alt={`${boat.title} - Image ${index + 1}`}
                          fill
                          style={{ objectFit: "contain" }}
                          className="boat-gallery-image"
                        />
                        <div className="boat-gallery-overlay">
                          <i className="ri-zoom-in-line" />
                        </div>
                      </div>
                      )}
                    </Item>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </Gallery>
          <Modal isOpen={Boolean(previewVideo)} toggle={() => setPreviewVideo(null)} centered size="lg">
            <ModalBody className="p-0 bg-dark">
              {previewVideo && (
                <video
                  src={previewVideo}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: "100%", maxHeight: "80vh", display: "block", background: "#000" }}
                />
              )}
            </ModalBody>
          </Modal>
        </div>
      )}

      {/* Overview / Specifications */}
      {specs.length > 0 && (
        <div id="overview" className="mb-4">
          <h4 className="detail-page-title">Specifications</h4>
          <Row className="g-3">
            {specs.map(({ label, value }) => (
              <Col md={6} key={label}>
                <div className="spec-item">
                  <strong>{label}:</strong> <span>{value}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Description */}
      {boat.description && (
        <div id="description" className="mb-4">
          <h4 className="detail-page-title">Description</h4>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.description) }} />
        </div>
      )}

      {/* Additional Details */}
      {boat.additionalDetails && boat.additionalDetails.length > 10 && (
        <div id="additional" className="mb-4">
          <h4 className="detail-page-title">Additional Details</h4>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.additionalDetails) }} />
        </div>
      )}

      {/* Brochure Download */}
      {(boat.brochures?.length || boat.brochure) && (
        <div id="brochure" className="mb-4">
          <h4 className="detail-page-title">Brochures</h4>
          <div className="d-flex flex-wrap gap-2">
            {(boat.brochures?.length ? boat.brochures : [{ url: boat.brochure || "", name: "Brochure" }]).map((brochure, index) => (
              <a key={`${brochure.url}-${index}`} href={brochure.url} target="_blank" rel="noopener noreferrer" className="btn-solid">
                Download {brochure.name || `Brochure ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoatDetailBody;

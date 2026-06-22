"use client";
import { Property2SwiperSetting } from "@/data/demo/propertyDemo2";
import { PropertyCardType } from "@/types/Product";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowDownToLine, MoveHorizontal, Play, Ruler, Zap } from "lucide-react";

const Boat2DetailBox: FC<PropertyCardType> = ({ data, label, index }) => {
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const priceLabel = data.price != null ? (
    <>
      {formatPrice(data.price)} <span style={{fontFamily: 'Satisfy'}}>€</span>
    </>
  ) : "Price upon inquiry";

  // Length: meters and feet (1 m ≈ 3.28084 ft)
  const lengthM = data.hullLength ?? 0;
  const lengthFt = Math.round(lengthM * 3.28084 * 10) / 10;
  const lengthText = lengthM > 0 ? `${lengthM} m (${lengthFt} ft)` : "—";

  // Engine: kW and hp (1 kW ≈ 1.34102 hp). DB stores engine_power in kW.
  const powerKw = data.enginePower ?? 0;
  const powerHp = Math.round(powerKw * 1.34102 * 10) / 10;
  const powerText = powerKw > 0 ? `${powerKw} kW (${powerHp} hp)` : "—";
  const beamM = data.beam ?? 0;
  const beamFt = Math.round(beamM * 3.28084 * 10) / 10;
  const beamText = beamM > 0 ? `${beamM} m (${beamFt} ft)` : "—";
  const draftM = data.draft ?? 0;
  const draftFt = Math.round(draftM * 3.28084 * 10) / 10;
  const draftText = draftM > 0 ? `${draftM} m (${draftFt} ft)` : "—";
  const conditionLabel = data.condition === "new" ? "New" : data.condition === "pre-owned" ? "Pre-owned" : label || "For Sale";
  const mediaItems = data.media?.length
    ? data.media
    : data.image.map((url) => ({ url, type: "image" as const }));
  const detailHref = `/services/brokerage/${data.slug || data.id}`;

  return (
    <article className='car2-featured-box property2-featured-box'>
      <Link href={detailHref} className='car2-featured-img'>
        <Swiper {...Property2SwiperSetting}>
          <div className='swiper-wrapper'>
            {mediaItems.map((media, i) => {
              return (
                <SwiperSlide key={i}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                    {media.type === "video" ? (
                      <>
                        <video
                          src={media.url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="metadata"
                          className='bg-img'
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-light btn-sm position-absolute top-50 start-50 translate-middle d-inline-flex align-items-center gap-1"
                          style={{ zIndex: 3 }}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setPreviewVideo(media.url);
                          }}
                        >
                          <Play size={14} /> Preview
                        </button>
                      </>
                    ) : (
                      <Image
                        src={media.url}
                        alt={`${data.title} - ${i + 1}`}
                        fill
                        sizes="(max-width: 575px) 100vw, (max-width: 1199px) 50vw, 25vw"
                        quality={72}
                        className='bg-img'
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </div>
          <div className='swiper-button-next' />
          <div className='swiper-button-prev' />
        </Swiper>
        <div className='car2-label-flex'>
          <span className='bg-white'>{conditionLabel}</span>
          {data.year && <span className='text-white'>{data.buildYear || data.year}</span>}
        </div>
      </Link>
      <div className='car2-featured-content'>
        <div className='boat-card-body'>
          <Link href={detailHref}>
            <h4>{data.title}</h4>
          </Link>
          <div className='location-flex'>
            <SvgIcon iconId="/property/sprite/featured.svg#4" />
            <h6>{data.location}</h6>
          </div>
          <ul className='featured-list boat-spec-list'>
            <li title="Length">
              <Ruler className="boat-feature-icon" aria-hidden />
              <span>{lengthText}</span>
            </li>
            <li title="Engine power">
              <Zap className="boat-feature-icon" aria-hidden />
              <span>{powerText}</span>
            </li>
            <li title="Beam">
              <MoveHorizontal className="boat-feature-icon" aria-hidden />
              <span>{beamText}</span>
            </li>
            <li title="Draft">
              <ArrowDownToLine className="boat-feature-icon" aria-hidden />
              <span>{draftText}</span>
            </li>
          </ul>
        </div>
        <div className='price-flex'>
          <h4>{priceLabel}</h4>
          <Link href={detailHref} className='btn-solid'>
            View
          </Link>
        </div>
      </div>
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
    </article>
  );
};

export default Boat2DetailBox;

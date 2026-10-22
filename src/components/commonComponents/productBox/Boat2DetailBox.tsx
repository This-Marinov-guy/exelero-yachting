"use client";
import { Property2SwiperSetting } from "@/data/demo/propertyDemo2";
import { PropertyCardType } from "@/types/Product";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import { VideoPlayer, VideoPoster } from "@/components/commonComponents/VideoMedia";
import Link from "@/components/commonComponents/LocalizedLink";
import { usePublicText } from "@/lib/usePublicText";
import { usePublicLocale } from "@/app/i18n/i18n-context";
import { FC, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowDownToLine, MoveHorizontal, Play, Ruler, Zap } from "lucide-react";
import { useRecoveringCarouselMedia } from "@/lib/useRecoveringCarouselMedia";

const Boat2DetailBox: FC<PropertyCardType> = ({ data, label, index }) => {
  const tr = usePublicText();
  const locale = usePublicLocale();
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const priceLabel = data.price != null ? (
    <>
      {formatPrice(data.price)} <span style={{fontFamily: 'Satisfy'}}>€</span>
    </>
  ) : tr("Price upon inquiry");

  const lengthM = data.hullLength ?? 0;
  const lengthText = lengthM > 0 ? `${lengthM} m` : "—";

  const powerKw = data.enginePower ?? 0;
  const powerText = powerKw > 0 ? `${powerKw} kW` : "—";
  const beamM = data.beam ?? 0;
  const beamText = beamM > 0 ? `${beamM} m` : "—";
  const draftM = data.draft ?? 0;
  const draftText = draftM > 0 ? `${draftM} m` : "—";
  const conditionLabel = tr(data.condition === "new" ? "New" : data.condition === "pre-owned" ? "Pre-owned" : label || "For Sale");
  const mediaItems = data.media?.length
    ? data.media
    : data.image.map((url) => ({ url, type: "image" as const }));
  const { availableMedia, imageSource, onImageError } = useRecoveringCarouselMedia(mediaItems);
  const detailHref = `/services/brokerage/${data.slug || data.id}`;

  return (
    <article className='car2-featured-box property2-featured-box boat-featured-box'>
      <Link href={detailHref} className='car2-featured-img'>
        {availableMedia.length > 0 ? <Swiper {...Property2SwiperSetting} key={availableMedia.map((media) => media.url).join("|")} loop={availableMedia.length > 1}>
          <div className='swiper-wrapper'>
            {availableMedia.map((media, i) => {
              return (
                <SwiperSlide key={i}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                    {media.type === "video" ? (
                      <>
                        <VideoPoster
                          url={media.url}
                          title={`${data.title} - Video ${i + 1}`}
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
                          <Play size={14} /> {tr("Preview")}
                        </button>
                      </>
                    ) : (
                      <Image
                        src={imageSource(media.url)}
                        alt={`${data.title} - ${i + 1}`}
                        fill
                        sizes="(max-width: 575px) 100vw, (max-width: 1199px) 50vw, 25vw"
                        quality={72}
                        onError={() => onImageError(media.url)}
                        className='bg-img'
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </div>
          <div className='swiper-button-next' />
          <div className='swiper-button-prev' />
        </Swiper> : <div className="boat-card-media-unavailable" role="status">{tr("Photos are temporarily unavailable.")}</div>}
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
            <li>
              <span className="boat-spec-icon" data-tooltip={tr("Length")} aria-label={tr("Length")} tabIndex={0}>
                <Ruler className="boat-feature-icon" aria-hidden />
              </span>
              <span>{lengthText}</span>
            </li>
            <li>
              <span className="boat-spec-icon" data-tooltip={tr("Engine power")} aria-label={tr("Engine power")} tabIndex={0}>
                <Zap className="boat-feature-icon" aria-hidden />
              </span>
              <span>{powerText}</span>
            </li>
            <li className="boat-spec-secondary">
              <span className="boat-spec-icon" data-tooltip={tr("Beam")} aria-label={tr("Beam")} tabIndex={0}>
                <MoveHorizontal className="boat-feature-icon" aria-hidden />
              </span>
              <span>{beamText}</span>
            </li>
            <li className="boat-spec-secondary">
              <span className="boat-spec-icon" data-tooltip={tr("Draft")} aria-label={tr("Draft")} tabIndex={0}>
                <ArrowDownToLine className="boat-feature-icon" aria-hidden />
              </span>
              <span>{draftText}</span>
            </li>
          </ul>
        </div>
        <div className='price-flex'>
          <h4>{priceLabel}</h4>
          <Link href={detailHref} className='btn-solid'>
            {tr("View")}
          </Link>
        </div>
      </div>
      <Modal isOpen={Boolean(previewVideo)} toggle={() => setPreviewVideo(null)} centered size="lg">
        <ModalBody className="p-0 bg-dark">
          {previewVideo && (
            <VideoPlayer
              url={previewVideo}
              title={`${data.title} ${tr("video")}`}
              style={{ width: "100%", maxHeight: "80vh", display: "block", background: "#000" }}
            />
          )}
        </ModalBody>
      </Modal>
    </article>
  );
};

export default Boat2DetailBox;

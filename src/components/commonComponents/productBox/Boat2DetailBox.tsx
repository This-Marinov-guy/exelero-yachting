"use client";
import { Property2SwiperSetting } from "@/data/demo/propertyDemo2";
import { PropertyCardType } from "@/types/Product";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Ruler, Zap } from "lucide-react";

const Boat2DetailBox: FC<PropertyCardType> = ({ data, label, index }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Length: meters and feet (1 m ≈ 3.28084 ft)
  const lengthM = data.hullLength ?? 0;
  const lengthFt = Math.round(lengthM * 3.28084 * 10) / 10;
  const lengthText = lengthM > 0 ? `${lengthM} m (${lengthFt} ft)` : "—";

  // Engine: kW and hp (1 kW ≈ 1.34102 hp). DB stores engine_power in kW.
  const powerKw = data.enginePower ?? 0;
  const powerHp = Math.round(powerKw * 1.34102 * 10) / 10;
  const powerText = powerKw > 0 ? `${powerKw} kW (${powerHp} hp)` : "—";

  // Check if image is external URL
  const isExternalUrl = (img: string): boolean => {
    return !!(img && (img.startsWith("http://") || img.startsWith("https://")));
  };

  return (
    <article className='car2-featured-box property2-featured-box'>
      <Link href={`/services/brokerage/${data.id}`} className='car2-featured-img'>
        <Swiper {...Property2SwiperSetting}>
          <div className='swiper-wrapper'>
            {data.image.map((src, i) => {
              return (
                <SwiperSlide key={i}>
                  <div style={{ position: "relative", width: "100%", height: "268px" }}>
                    <Image 
                      src={src} 
                      alt='boat-img' 
                      fill
                      className='bg-img object-cover' 
                      unoptimized={isExternalUrl(src)} 
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </div>
          <div className='swiper-button-next' />
          <div className='swiper-button-prev' />
        </Swiper>
        <div className='car2-label-flex'>
          <span className='bg-white'>{label || 'For Sale'}</span>
          {data.year && <span className='text-white'>{data.buildYear || data.year}</span>}
        </div>
      </Link>
      <div className='car2-featured-content'>
        <Link href={`/services/brokerage/${data.id}`}>
          <h4>{data.title}</h4>
        </Link>
        <div className='location-flex'>
          <SvgIcon iconId="/property/sprite/featured.svg#4"/>          
          <h6>{data.location}</h6>
        </div>
        <ul className='featured-list' style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
          <li>
            <Ruler className="boat-feature-icon" aria-hidden />
            <span>{lengthText}</span>
          </li>
          <li>
            <Zap className="boat-feature-icon" aria-hidden />
            <span>{powerText}</span>
          </li>
        </ul>
        <div className='price-flex'>
          <h4>
            {formatPrice(data.price || 0)} <span style={{fontFamily: 'Satisfy'}}>€</span>
          </h4>
          <a href={`/services/brokerage/${data.id}`} target="_blank" className='btn-solid'>
            View
          </a>
        </div>
      </div>
    </article>
  );
};

export default Boat2DetailBox;

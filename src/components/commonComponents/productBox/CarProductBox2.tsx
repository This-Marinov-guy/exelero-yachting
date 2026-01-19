import { ImagePath, SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { Rating } from "react-simple-star-rating";
import { Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CarProductBox2: FC<ProductCardType> = ({ data }) => {
  return (
    <article className='car2-featured-box'>
      <Link href={RouteList.Car.Detail.CarClassic} className='car2-featured-img'>
        <Swiper pagination={{clickable:true}} modules={[Pagination, EffectFade]} className='car2-featured-slider ratio_60' effect='fade'>
          <div className='overlay-box' />
          {data.image.map((imgSrc: string, idx: React.Key | null | undefined) => (
            <SwiperSlide key={idx} className='bg-size'>
              <RatioImage  src={`${ImagePath}/${imgSrc}`} alt={`featured-img-${idx}`} className='img-fluid bg-img' />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='car2-label-flex'>
          <span>Featured</span>
          <span>Rent</span>
        </div>
      </Link>
      <div className='car2-featured-content'>
        <div className='rating-flex'>
          <Link href={RouteList.Car.Detail.CarClassic}>
            <h4>{data.title}</h4>
          </Link>
          <ul className='rate-list'>
            <Rating initialValue={5} size={17} fillColor='rgba(var(--title-color), 1)' />
          </ul>
        </div>
        <p>{data.description}</p>
        <ul className='tag-list'>
          <li>Classic design</li>
          <li>Comfortable interior</li>
        </ul>
        <ul className='featured-list'>
          {data.features.map((item, index) => (
            <li key={index}>
              <Image height={20} width={20} src={`${SVGPath}/${item.icon}`} alt='profile-2user' className='img-fluid' />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className='price-flex'>
          <h4>
            ${data.price}/<span>Per day</span>
          </h4>
          <Link href={RouteList.Car.Detail.CarClassic} className='btn-pills'>
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CarProductBox2;

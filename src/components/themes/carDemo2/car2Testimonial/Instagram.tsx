import { Href, ImagePath } from "@/constants";
import { Car2InstagramSlider, InstagramImages } from "@/data/demo/carDemo2";
import RatioImage from "@/utils/RatioImage";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

const Instagram = () => {
  return (
    <section className='section-t-lg-space car2-insta-section'>
      <Swiper {...Car2InstagramSlider} >
        <div className='swiper-wrapper'>
          {InstagramImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Link scroll={false} href={Href} className='insta-img'>
                <RatioImage src={`${ImagePath}/car2/insta/${image}.jpg`} alt='i-1' className='bg-img' />
                <div className='insta-overlay'>
                  <i className='ri-instagram-line' />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </section>
  );
};

export default Instagram;

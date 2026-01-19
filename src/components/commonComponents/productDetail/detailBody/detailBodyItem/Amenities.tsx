import { AmenitiesTitle, ImagePath } from "@/constants";
import { AmenitiesSlider, AmenitiesSliderData } from "@/data/property";
import { DetailBodyItemType } from "@/types/Product";
import RatioImage from "@/utils/RatioImage";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const Amenities: FC<DetailBodyItemType> = ({ label, type }) => {
  return (
    <div className='detail-body' id='amenities'>
      {label && <h4 className='detail-page-title'>{AmenitiesTitle}</h4>}
      <Swiper {...AmenitiesSlider} className='amenities-slider ratio_square'>
        {AmenitiesSliderData.map((item, i) => {
          return (
            <SwiperSlide key={i}>
              <div className='categories-box'>
                <RatioImage src={`${ImagePath}/property/${item.image}.jpg`} alt='categories' className='img-fluid bg-img' />
                <div className='categories-box-border'>
                  <div className='icon-name'>
                    <h5>{item.title}</h5>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Amenities;

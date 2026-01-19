import BlogGridCard from "@/components/commonComponents/blogGridView/blogDetailBox/BlogGridCard";
import { SliderBlogTitle } from "@/constants";
import { BlogData, BlogSliderData } from "@/data/pages";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Swiper, SwiperSlide } from "swiper/react";

const BlogTopSlider = () => {
  return (
    <div>
      <div className='detail-flex-title'>
        <h3>{SliderBlogTitle}</h3>
        <div className='swiper-flex car-arrow'>
          <div className='swiper-button-prev blog-prev-swiper'>
            <ArrowLeft2 className='iconsax' color='white' size={24} />
          </div>
          <div className='swiper-button-next blog-next-swiper'>
            <ArrowRight2 className='iconsax' color='white' size={24} />
          </div>
        </div>
      </div>
      <Swiper {...BlogSliderData} className='blog-breadcrumbs-slider ratio3_2'>
        {BlogData.map((item, i) => {
          return (
            <SwiperSlide key={i}>
              <BlogGridCard data={item} index={i} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BlogTopSlider;

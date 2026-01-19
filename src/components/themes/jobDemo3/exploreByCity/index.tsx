import { ImagePath } from "@/constants";
import { ExploreCityData, JobCityData } from "@/data/demo/jobDemo3";
import { RouteList } from "@/utils/RouteList";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const ExploreByCity = () => {
  return (
    <section className='job3-category section-b-space'>
      <Container>
        <div className='detail-flex-title'>
          <h2 className='text-white'>Explore Job by Cities</h2>
          <div className='swiper-flex car-arrow'>
            <div className='swiper-button-prev job-category-prev'>
              <ArrowLeft2 className='iconsax'/>
            </div>
            <div className='swiper-button-next job-category-next'>
              <ArrowRight2 className='iconsax'/>
            </div>
          </div>
        </div>
        <Swiper {...ExploreCityData} className='job3-category-slider'>
          {JobCityData.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <div className='category-box'>
                  <Link href={RouteList.Job.Grid.JobGrid2} className='category-img'>
                    <Image width={354} height={393} src={`${ImagePath}/job-3/category/${item.image}`} alt='c-1' className='img-fluid' unoptimized/>
                  </Link>
                  <Link href={RouteList.Job.Grid.JobGrid2} className='d-block'>
                    <h4>{item.title}</h4>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
          ;
        </Swiper>
      </Container>
    </section>
  );
};

export default ExploreByCity;

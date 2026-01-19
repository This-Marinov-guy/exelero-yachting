import { ApplyNow, ImagePath, SVGPath, TopRatedCompany } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { RouteList } from "@/utils/RouteList";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeader from "../../common/CommonHeader";
import { Job3BoxSlider, TopRatedCompanyContent } from "@/data/demo/jobDemo3";
import RatioImage from "@/utils/RatioImage";

const TopCompany = () => {
  const { productItem } = useAppSelector((state) => state.product);
  
  return (
    <section className='rated-job-section position-relative overflow-x-hidden'>
      <RatioImage src={`${SVGPath}/job/o-1.svg`} alt='o-1' className='RatioImage-fluid object-1 position-absolute' />
      <RatioImage src={`${SVGPath}/job/o-2.svg`} alt='o-2' className='img-fluid object-2 position-absolute' />
      <Image height={58} width={168} src={`${ImagePath}/job-3/about/objects.png`} alt='o-1' className='img-fluid object-dots position-absolute' />
      <Container>
        <CommonHeader title={TopRatedCompany} content={TopRatedCompanyContent} headClass='title-style-5' />
        <Swiper {...Job3BoxSlider} pagination={{ clickable: true }}>
          {productItem.filter(({ id }) => id >= 16 && id <= 21).map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className='company-job-box'>
                    <div className='company-logo'>
                      {item.image.map((url, index) => {
                        return <Image height={70} width={70} src={`${SVGPath}/${url}`} key={index} alt='company-logo' className='img-fluid' />;
                      })}
                    </div>
                    <div className='company-content'>
                      <Link href={RouteList.Job.Grid.JobGrid2} className='d-block company-job-title'>
                        <h5>{item.company}</h5>
                      </Link>
                      <ul className='hire-list'>
                        <li>
                          <SvgIcon iconId='property/sprite/star.svg#star-svg' />
                          {item.rating}
                        </li>
                        <li>{item.location}</li>
                      </ul>
                      <Link href={RouteList.Job.Grid.JobGrid2} className='d-block'>
                        <h5>{item.title}</h5>
                      </Link>
                      <Link href={RouteList.Pages.Other.AboutUs1} className='btn-solid'>
                        {ApplyNow}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          <div className='swiper-pagination' />
        </Swiper>
      </Container>
    </section>
  );
};

export default TopCompany;

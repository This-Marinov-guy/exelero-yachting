import VideoModal from "@/components/commonComponents/modal/VideoModal";
import { Href, ImagePath, VideoPath } from "@/constants";
import { PropertyDetailType } from "@/types/Product";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import { FC, Fragment } from "react";
import { Col, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import ThumbSliderSet from "../../../property/details/propertyThumbSlider/thumbSlider";
import RenderImageItem from "./RenderImage";
import { DetailBreadcrumbsSlider, ExpandCarSlider } from "@/data/car";
import { Gallery } from "react-photoswipe-gallery";

const DetailImages: FC<PropertyDetailType> = ({ type, thumb, multiple }) => {
  return (
    <Fragment>
      {type === "video" || type === 'car-video' ? (
        <div className={`${type === 'video' ? 'breadcrumbs-section breadcrumbs-video image-radius' : 'h-100'}`}>
          <video autoPlay loop>
            <source src={`${VideoPath}/${type === 'video' ? 'breadcrumbs.mp4' : 'car-breadcrumbs.mp4'}`} type='video/mp4' />
            <source src={`${VideoPath}/${type === 'video' ? 'breadcrumbs.mp4' : 'car-breadcrumbs.mp4'}`} type='video/ogg' />
          </video>
        </div>
      ) : type === "sidebar-layout" ? (
        <div className='detail-images'>
          <RatioImage src={`${ImagePath}/property/detail-main/1.jpg`} alt='' className='img-fluid bg-img' />
        </div>
      ) : thumb ? (
        <ThumbSliderSet />
      ) : type === "image-slider" || type === "car-image-slider" || type === "expand-slider" ? (
        <Fragment>
          <Swiper {...(type === "expand-slider" ? ExpandCarSlider : DetailBreadcrumbsSlider)} className={`${type === "car-image-slider" ? "car-detail-slider" : type === "expand-slider" ? "car-expand-slider" : "detail-breadcrumbs-slider image-radius"} ratio_130 `}>
            {dynamicNumber(9).map((item, i) => (
              <SwiperSlide key={i}>
                {type === "expand-slider" ? (
                  <a href={Href} className='car-slider-img'>
                    <RatioImage src={`${ImagePath}/car/product/${item}.jpg`} alt='b-1' className='img-fluid' />
                  </a>
                ) : (
                  <div className={`breadcrumbs-img`}>
                    <RatioImage src={`${ImagePath}${type === "car-image-slider" ? "/car/product/" : "/property/detail-main/"}${item}.jpg`} alt='b-1' className='img-fluid bg-img' />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Fragment>
      ) : type === "car-detail" ? (
        <Gallery>
          {multiple ? (
            <Row className='ratio3_2 g-sm-3 g-2'>
              {dynamicNumber(7).map((item) => (
                <RenderImageItem item={item} type={type} multiple={multiple} key={item} />
              ))}
            </Row>
          ) : (
            <Row className='ratio3_2 g-3'>
              <RenderImageItem item={1} type={type} multiple={multiple} />
              <Col lg='6'>
                <Row className='g-sm-3 g-2'>
                  {dynamicNumber(4).map((item) => (
                    <RenderImageItem item={item + 1} type={type} multiple={multiple} key={item} />
                  ))}
                </Row>
              </Col>
            </Row>
          )}
          <VideoModal />
        </Gallery>
      ) : type === "car-layout2" ? (
        <></>
      ) : (
        <Row className='ratio_landscape m-0 image-radius'>
          <Gallery>
            <RenderImageItem item={1} type={type} multiple={multiple} />
            <Col md={6} className='p-0'>
              <Row className='m-0'>
                {dynamicNumber(4).map((item) => (
                  <RenderImageItem item={item + 1} type={type} multiple={multiple} key={item} />
                ))}
              </Row>
            </Col>
          </Gallery>
        </Row>
      )}
    </Fragment>
  );
};

export default DetailImages;

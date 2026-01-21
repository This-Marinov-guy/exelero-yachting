"use client";
import Pagination from "@/components/commonComponents/gridView/filter/Pagination";
import { Href, ImagePath } from "@/constants";
import { PortfolioBoxSlider, PortfolioItems } from "@/data/pages/Portfolio";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVideoModal } from "@/redux/reducers/LayoutSlice";
import { PortfolioBoxType } from "@/types/Portfolio";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import { Play } from "iconsax-react";
import Link from "next/link";
import { FC, Fragment, Ref, useEffect, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Button, Col, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const PortfolioBox: FC<PortfolioBoxType> = ({ activeTab, type, gridSize }) => {
  const { cardToShow } = useAppSelector((state) => state.layout);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();

  const Portfolio = PortfolioItems.filter((item) => item.type === activeTab || "all" === activeTab);
  const totalPages = Math.ceil(Portfolio?.length / cardToShow);
  const showPortfolio = Portfolio?.slice(cardToShow * currentPage - cardToShow, cardToShow * currentPage);

  useEffect(() => setCurrentPage(1), [activeTab]);
  return (
    <Fragment>
      <div className='m-p-g'>
        <Row className={`grid ${type !== "image_change" ? "m-p-g__thumbs row-2-grid row-grid" : ""} ratio3_2  g-3 g-xl-4`}>
          <Gallery>
            {showPortfolio.map((item, i) => (
              <Col sm={6} key={i} className={`grid-item ${gridSize === 3 ? "col-lg-4" : gridSize === 4 ? "col-xl-3 col-lg-4" : ""}`}>
                {type === "image_change" ? (
                  <div className='image-hover-box'>
                    <div className='image-both-box'>
                      <div className='front'>
                        <Link href={RouteList.Pages.Portfolio.Detail.PortfolioDetail1}>
                          <RatioImage src={`${ImagePath}/${item.image}`} alt='blog' className='bg-img' />
                        </Link>
                      </div>
                      <div className='back'>
                        <Link href={RouteList.Pages.Portfolio.Detail.PortfolioDetail1}>
                          <RatioImage src={`${ImagePath}/${item.backImage}`} alt='blog' className='bg-img' />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : type === "Box_slider" ? (
                  <div className='portfolio-slider-box'>
                    <Swiper {...PortfolioBoxSlider} className='portfolio-images-slider'>
                      {item.slider.map((src, i) => {
                        return (
                          <SwiperSlide key={i}>
                            <Link href={RouteList.Pages.Portfolio.Detail.PortfolioDetail1} className='slider-img'>
                              <RatioImage src={`${ImagePath}/portfolio/${src}.jpg`} alt='slider-img' className='bg-img' />
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                ) : (
                  <div className='blog-box blog-grid'>
                    <Item original={`${ImagePath}/${item.image}`} width='1100' height='1000'>
                      {({ ref, open }) =>
                        type === "Gallery-icon" ? (
                          <div className='img-box bg-size' style={{ backgroundImage: `url(${ImagePath}/${item.image})` }}>
                            <img className='bg-img img-fluid' ref={ref as unknown as Ref<HTMLImageElement>} src={`${ImagePath}/${item.image}`} alt='Image_description' style={{ display: "none" }} />
                            <div className='portfolio-icon-flex'>
                              <Link scroll={false} href={Href} onClick={open} className='play-btn search-btn m-p-g__thumbs-img' />
                              <Link href={RouteList.Pages.Portfolio.Detail.PortfolioDetail1} className='play-btn link-btn' />
                            </div>
                          </div>
                        ) : (
                          <Link scroll={false} href={Href} onClick={open} className='img-box m-p-g__thumbs-img bg-size' style={{ backgroundImage: `url(${ImagePath}/${item.image})` }}>
                            <img className='bg-img img-fluid' ref={ref as unknown as Ref<HTMLImageElement>} src={`${ImagePath}/${item.image}`} alt='Image_description' style={{ display: "none" }} />
                          </Link>
                        )
                      }
                    </Item>
                    {type === "transform" && (
                      <div className='portfolio-content'>
                        <h3>{item.title}</h3>
                        <h6>{item.text}</h6>
                      </div>
                    )}
                    {type === "video" && (
                      <Button className='play-btn' onClick={() => dispatch(setVideoModal())}>
                        <Play className='iconsax' size={25} color='white' />
                      </Button>
                    )}
                  </div>
                )}
              </Col>
            ))}
          </Gallery>
        </Row>
      </div>
      <Pagination type={type} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </Fragment>
  );
};

export default PortfolioBox;

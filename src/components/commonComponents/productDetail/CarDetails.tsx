import { Href, ImagePath } from "@/constants";
import { CarDetailTabs, classicSliderData } from "@/data/car";
import { useAppDispatch } from "@/redux/hooks";
import { setVideoModal } from "@/redux/reducers/LayoutSlice";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { PropertyDetailType } from "@/types/Product";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import UseStickyBar from "@/utils/UseStickyBar";
import { ArrowLeft2, ArrowRight2, Play } from "iconsax-react";
import { FC, useEffect, useState } from "react";
import { Button, Col, Container, Nav, NavItem, NavLink, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import DetailBody from "./detailBody";
import DetailImages from "./detailImages/DetailImages";
import DetailSidebar from "./detailSidebar";
import RelatedProperty from "./RelatedProperty";

const CarDetail: FC<PropertyDetailType> = ({ type, detailImages, scrollspy, classicSlider }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);
  const fix = UseStickyBar(300);
  const [activeTab, setActiveTab] = useState(CarDetailTabs[0].id);

  const toggle = (id: string) => {
    setActiveTab(id);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" }); // Smooth scroll to section
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 20;

      CarDetailTabs.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className={`section-b-space car-detail-section`}>
      <Container>
        {detailImages && (
          <div className='car-detail-image'>
            <DetailImages type='car-detail' />
          </div>
        )}
        <Row className='custom-row'>
          <Col lg={9}>
            {scrollspy && (
              <div className={`sticky-nav ${fix ? "sticky" : ""}`}>
                <Nav pills>
                  {CarDetailTabs.map(({ id, label }) => (
                    <NavItem key={id} onClick={() => toggle(id)}>
                      <NavLink className={`${activeTab === id ? "active" : ""}`} data-to-scrollspy-id={id} href={`#${id}`}>
                        {label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
            )}
            {classicSlider && (
              <div className='car-detail-image position-relative'>
                <Swiper {...classicSliderData} className='detail-simple-slider ratio2_3'>
                  {dynamicNumber(9).map((img, i) => (
                    <SwiperSlide key={i}>
                      <a href={Href}>
                        <RatioImage src={`${ImagePath}/car/product/${img}.jpg`} alt={`d-img-${img}`} className='img-fluid bg-img' />
                      </a>
                    </SwiperSlide>
                  ))}
                  <div className='swiper-button-next'>
                    <ArrowRight2 className="iconsax" />
                  </div>
                  <div className='swiper-button-prev'>
                    <ArrowLeft2 className="iconsax" />
                  </div>
                </Swiper>
                <Button className='video-modal-btn' onClick={() => dispatch(setVideoModal())}>
                  <Play className="iconsax" />
                  Video
                </Button>
              </div>
            )}
            <div className='car-detail-right'><DetailBody type={type} /></div>
          </Col>
          <Col lg={3}>
            <DetailSidebar type={type} />
          </Col>
        </Row>
        <RelatedProperty type={type} />
      </Container>
    </div>
  );
};

export default CarDetail;

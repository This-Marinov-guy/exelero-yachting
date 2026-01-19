import { ImagePath } from "@/constants";
import { PropertyHomeSliderSetting } from "@/data/demo/propertyDemo1";
import { dynamicNumber } from "@/utils";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import PropertyFilter from "./propertyFilter";

const Property1HomeSection = () => {
  return (
    <div className='property-home-section'>
      <Container>
        <Row className='m-auto g-0'>
          <Col xl={10} lg={11}>
            <div className='home-content'>
              <h1>Discover suitable real estate for your family</h1>
              <p>This is where you may locate a dream place for you of any sort anywhere in the world at an inexpensive price.</p>
              <Link href={RouteList.Property.Grid.Property3Grid} className='btn-solid btn-border'>
                Discover more
              </Link>
              <PropertyFilter />
            </div>
          </Col>
          <div className='property-home-img'>
            <Swiper {...PropertyHomeSliderSetting} className='property-home-slider'>
              {dynamicNumber(3).map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Image fill src={`${ImagePath}/property/home/${item}.jpg`} alt={`h-${item}`} className='img-fluid' unoptimized/>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Property1HomeSection;

import { ImagePath } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import { Col, Container, Row } from "reactstrap";
import LogoSection from "../../common/LogoSection";
import FilterSection from "./filterSection";

const Property2HomeSection = () => {
  return (
    <div className='property2-section overflow-hidden'>
      <RatioImage src={`${ImagePath}/property2/home-img.jpg`} alt='home-img' className='bg-img' />
      <Container>
        <Row className='justify-content-between align-items-center gy-lg-0 gy-4'>
          <Col lg={7}>
            <div className='home-content'>
              <h1> Discover suitable <span>real estate</span> for your family </h1>
              <p>This is where you may locate a dream place for you of any sort anywhere in the world at an inexpensive price.</p>
            </div>
          </Col>
          <Col xxl={4} lg={5}>
            <FilterSection />
          </Col>
        </Row>
      </Container>
      <LogoSection swiperClass='logo-car2-slider' />
    </div>
  );
};

export default Property2HomeSection;

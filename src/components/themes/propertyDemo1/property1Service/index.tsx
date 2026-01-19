import { ImagePath, OurServiceTitle, SVGPath } from "@/constants";
import { PropertyServiceContent, PropertyServiceData } from "@/data/demo/propertyDemo1";
import { Button, Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { useAppDispatch } from "@/redux/hooks";
import { setVideoModal } from "@/redux/reducers/LayoutSlice";
import { Play } from "iconsax-react";
import VideoModal from "@/components/commonComponents/modal/VideoModal";

const Property1Service = () => {
  const dispatch = useAppDispatch();

  return (
    <section className='section-b-space property-service-section bg-color'>
      <Container>
        <Row className='gy-lg-0 gy-4'>
          <Col lg={5}>
            <div className='service-content'>
              <CommonHeader title={OurServiceTitle} content={PropertyServiceContent} headClass="title-style-1" />
              <ul className='service-list'>
                {PropertyServiceData.map((item, index) => (
                  <li key={index}>
                    <div className='service-icon'>
                      <img src={`${SVGPath}/${item.image}`} alt='service-1' className='img-fluid' />
                    </div>
                    <div className='service-info'>
                      <h5>{item.title}</h5>
                      <p>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col lg={7}>
            <div className="service-img">
              <img src={`${ImagePath}/property/service.jpg`} alt="service" className="img-fluid" />
              <div className="service-sub-img">
                <img src={`${ImagePath}/other/about/a-2.jpg`} alt="service-sub" className="img-fluid" />
                <Button onClick={() => dispatch(setVideoModal())} color="transparent" className="play-btn">
                  <Play className="iconsax" />
                </Button>
                <VideoModal />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Property1Service;

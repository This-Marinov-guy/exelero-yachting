import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { SVGPath, WorkTitle } from "@/constants";
import { WorkContentData, WorkData } from "@/data/demo/demo1";
import Image from "next/image";
 
const Work = () => {
  return (
    <section className="car-work-section section-b-space">
      <Container>
        <CommonHeader title={WorkTitle} content={WorkContentData} headClass="title-style-2" animation />
        <Row className="g-lg-5 gy-4 align-items-center justify-content-center">   
            {WorkData.map((item, index) => (
              <Col lg="4" sm="6" key={index}>
                {item.svg && <Image width={227} height={21} src={`${SVGPath}/car/svg-line.svg`} alt="svg-line" className="img-fluid top-wave" />}
                <div className="work-box" data-aos="zoom-in" data-aos-duration={item.duration}>
                  <div className="work-icon">{item.icon}</div>
                  <div className="work-content">
                    <p>{item.text}</p>
                  </div>
                </div>
                {item.svg && <Image width={227} height={21} src={`${SVGPath}/car/svg-line.svg`} alt="svg-line" className="img-fluid bottom-wave" />}
              </Col>
            ))}          
        </Row>
      </Container>
    </section>
  );
};

export default Work;

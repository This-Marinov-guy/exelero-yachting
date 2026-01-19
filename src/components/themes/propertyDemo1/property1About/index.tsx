import { AboutTitle, GifPath, SVGPath } from "@/constants";
import { AboutList, PropertyAboutContent } from "@/data/demo/propertyDemo1";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const Property1About = () => {
  return (
    <section className='property-about-section section-b-space bg-color'>
      <Container>
        <Row className='align-items-center gy-lg-0 gy-4'>
          <Col lg={6} className='order-lg-0 order-1'>
            <div className='about-img'>
              <Image height={588} width={600} src={`${GifPath}/p-about.gif`} alt='about-img' className='img-fluid' unoptimized />
            </div>
          </Col>
          <Col lg={6}>
            <div className='about-content'>
              <CommonHeader headClass='title-style-1' title={AboutTitle} content={PropertyAboutContent} />
              <ul className='about-list'>
                {AboutList.map((item, i) => {
                  return (
                    <li key={i}>
                      <Image width={26} height={12} src={`${SVGPath}/property/about-us/arrow-5.svg`} alt={"arrow svg"} className='img-fluid' />
                      <h4>{item}</h4>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Property1About;

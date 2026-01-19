import { Href, ImagePath, LearnMore, PrimeCarRentals } from "@/constants";
import { About2List, PrimeCarRentalsContent } from "@/data/pages/Others";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";

const WelcomeSection = () => {
  return (
    <section className='service-page-first-section car-service-section car-about-2 section-b-space'>
      <Container>
        <Row className='gx-lg-5 gy-4'>
          <Col lg={6} className='order-lg-0 order-1'>
            <div className='service-img'>
              <Image width={597} height={371} src={`${ImagePath}/other/about/a-1.jpg`} alt='a-1' className='img-fluid main-img' unoptimized />
              <Image height={251} width={371} src={`${ImagePath}/other/about/a-2.jpg`} alt='a-2' className='img-fluid sub-img' unoptimized />
            </div>
          </Col>
          <Col lg={6}>
            <div className='service-main-content'>
              <div className='content-title text-start'>
                <h2>{PrimeCarRentals}</h2>
                <p className='w-75'>{PrimeCarRentalsContent}</p>
              </div>
              <ul className='about-list'>
                {About2List.map((item, i) => {
                  return (
                    <li key={i}>
                      <i className={item.icon} />
                      <h6>{item.feature}</h6>
                    </li>
                  );
                })}
              </ul>
              <Link scroll={false} href={Href} className='btn-solid'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WelcomeSection;

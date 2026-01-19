import { ImagePath } from "@/constants";
import { Details, FooterDetailData, HeaderClassMapFooter } from "@/data/layout/Footer";
import { PathTypes } from "@/types/Layout";
import { Col, Container, Row } from "reactstrap";
import FooterSearch from "./FooterSearch";
import FooterSocial from "./FooterSocial";
import FooterDetailSection from "./FooterDetailSection";
import RatioImage from "@/utils/RatioImage";

const FooterDemo2: React.FC<PathTypes> = ({ part }) => {
  const slicedData = FooterDetailData.slice(2, 5).reverse();
  let footerClass = "job3-footer";

  if (part?.includes("job-2")) {
    footerClass = "dark-footer-section section-t-space";
  } else {
    footerClass += ` ${HeaderClassMapFooter[part || ""] || ""}`;
  }
  return (
    <footer className={`${footerClass}`}>
      <Container>
        {!part?.includes("job-2") && <FooterSearch part={part}  />}
        <div className='dark-job-footer'>
          <Row className='justify-content-between gy-lg-0 gy-sm-4 gy-3'>
            <Col lg='4'>
              <FooterSocial details={Details[1]} endPoint={4} />
            </Col>
            <FooterDetailSection data={slicedData} />
          </Row>
        </div>
        <div className='copyright-box'>
          <p className="text-white">@ 2025 All Rights Reserved</p>
          <RatioImage src={`${ImagePath}/dark-job/payment-img.png`} alt='payment-img' className='img-fluid' />
        </div>
      </Container>
    </footer>
  );
};

export default FooterDemo2;

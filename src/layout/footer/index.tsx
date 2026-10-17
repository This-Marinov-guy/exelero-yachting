import { Details, FooterDetailData } from "@/data/layout/Footer";
import { PathTypes } from "@/types/Layout";
import { Col, Container, Row } from "reactstrap";
import FooterContactList from "./FooterContactList";
import FooterDetailSection from "./FooterDetailSection";
import FooterSocial from "./FooterSocial";
import FooterLanguageSelect from "./FooterLanguageSelect";
import CookieSettingsButton from "@/components/commonComponents/CookieSettingsButton";
import { useTranslation } from "react-i18next";

const Footer: React.FC<PathTypes> = ({ part }) => {
  const filteredData = FooterDetailData.filter((item) => !item.contactList);
  const { t } = useTranslation("common");
  
  return (
    <footer className={`property-footer-section${part?.includes("job") ? " job-footer-section" : ""}`}>
      <Container>
        <FooterContactList />
        <div className='dark-job-footer'>
          <Row className='gy-4'>
            <Col lg='3' xs='12'>
              <FooterSocial details={Details[0]} endPoint={3} />
            </Col>
            <Col lg='9' xs='12'>
              <Row className='gy-lg-4 gy-3'>
                <FooterDetailSection data={filteredData} footerDemo />
              </Row>
            </Col>
          </Row>
        </div>
        <FooterLanguageSelect />
        <div className="copyright"><p>© {new Date().getFullYear()} Exelero Yachting. {t("All rights reserved")}</p><CookieSettingsButton /></div>
      </Container>
    </footer>
  );
};

export default Footer;

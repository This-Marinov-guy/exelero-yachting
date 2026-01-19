import { ImagePath, MeetOurBrokers, SVGPath } from "@/constants";
import { SocialLinks, TeamData } from "@/data/demo/propertyDemo2";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import RatioImage from "@/utils/RatioImage";

const Team = () => {
  return (
    <section className='property2-team-section section-t-lg-space section-b-lg-space'>
      <Container>
        <CommonHeader title={MeetOurBrokers} headClass='title-style-1 title-style-6' subClass='horizontal-title' url={RouteList.Pages.Other.Team} view />
        <Row className='ratio_square justify-content-center gy-4'>
          {TeamData.map((item, i) => {
            return (
              <Col lg={3} sm={6} key={i}>
                <div className='team-box'>
                  <div className='team-img'>
                    <RatioImage src={`${ImagePath}/property2/team/${i + 1}.jpg`} alt={`team-${i + 1}`} className='bg-img' />
                  </div>
                  <div className='team-content'>
                    <h5>{item}</h5>
                    <ul className='team-social'>
                      {SocialLinks.map((social, j) => (
                        <li key={j}>
                          <Link href={social.href} target='_blank'>
                            <Image height={20} width={20} src={`${SVGPath}/property2/team/${j + 1}.svg`} alt={social.alt} className='img-fluid' />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default Team;

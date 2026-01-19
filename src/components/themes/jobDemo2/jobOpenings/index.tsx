import Job2DetailBox from "@/components/commonComponents/productBox/Job2DetailBox";
import { LatestJobOpenings } from "@/constants";
import { LatestJobOpeningsContent } from "@/data/demo/jobDemo2";
import { useAppSelector } from "@/redux/hooks";
import { RouteList } from "@/utils/RouteList";
import { ArrowRight } from "iconsax-react";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const JobOpenings = () => {
  const { productItem } = useAppSelector((state) => state.product);

  return (
    <section className='job-box-section section-b-space'>
      <Container>       
        <CommonHeader title={LatestJobOpenings} content={LatestJobOpeningsContent} headClass="title-style-4"/>
        <Row className='gy-4'>
            {productItem.filter((e) => [17, 20, 25, 27, 28].includes(e.id)).map((jobData, i) => (
              <Col xxl={4} lg={6} key={i} data-aos="fade-up" data-aos-duration={200 * (i + 1)} >
                  <Job2DetailBox data={jobData} />
              </Col>
            ))}
          <Col xxl={4} lg={6} data-aos='fade-up' data-aos-duration={1200}>
            <div className='job-box dark-job-box'>
              <span className='border-bg' />
              <div className='see-all-box'>
                <h2>135+</h2>
                <Link href={RouteList.Job.Grid.JobGrid2}>
                  Browse to all Job
                  <ArrowRight className='iconsax' size={25} color="white" />
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobOpenings;

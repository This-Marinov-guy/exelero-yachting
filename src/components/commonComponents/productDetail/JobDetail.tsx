import JobMainDetail from "@/components/job/detail/jobDetail2/mainDetail/JobMainDetail";
import { AboutRoleTitle, HowCanApplyTitle, IntroductionTitle, JobLikeTitle } from "@/constants";
import { AboutRoleContent, HowCanApplyContent, IntroductionContent, JobLikeTitleContent } from "@/data/job";
import { useAppDispatch } from "@/redux/hooks";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { PropertyDetailType } from "@/types/Product";
import { FC, Fragment, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import Benefits from "./detailBody/detailBodyItem/Benefits";
import JobDetailBox from "./detailBody/detailBodyItem/JobDetailBox";
import DetailSidebar from "./detailSidebar";
import RelatedProperty from "./RelatedProperty";

const JobDetail: FC<PropertyDetailType> = ({ detailType }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);

  return (
    <section className={`job-detail-section section-b-space ${detailType === "detail-2" ? "pt-0" : ""}`}>
      <Fragment>
        <Container>
          {detailType === "detail-2" && <JobMainDetail type={detailType} />}
          <Row className='gy-lg-0 gy-4'>
            <Col className={`${detailType === "detail-2" || detailType === "detail-5" ? "col-xl-9 col-lg-8 col-12" : detailType === "detail-3" ? "col-lg-7 col-12" : detailType === "detail-4" ? "col-lg-8 col-12" : "col-lg-8 col-12"}`}>
              {detailType === "detail-4" || detailType === "detail-5" ? <JobMainDetail type={detailType} /> : <></>}
              <div className={`job-description ${detailType === "detail-3" ? "detail-style-1" : ""}`}>
                {detailType === "detail-3" && <JobDetailBox title={IntroductionTitle} content={IntroductionContent} />}
                <JobDetailBox title={AboutRoleTitle} content={AboutRoleContent} />
                {detailType === "detail-2" || (detailType === "detail-3" && <Benefits />)}
                <JobDetailBox title={JobLikeTitle} content={JobLikeTitleContent} list />
                <JobDetailBox title={HowCanApplyTitle} content={HowCanApplyContent} list />
              </div>
            </Col>
            <Col className={`${detailType === "detail-2" || detailType === "detail-5" ? "col-xl-3 col-lg-4 col-12" : detailType === "detail-3" ? "col-lg-5 col-12" : detailType === "detail-4" ? "col-lg-4 col-12" : "col-lg-4 col-12"}`}>
              <DetailSidebar type='job' detailType={detailType} />
            </Col>
            <RelatedProperty type='job' />
          </Row>
        </Container>
      </Fragment>
    </section>
  );
};

export default JobDetail;

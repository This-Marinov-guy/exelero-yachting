import Job3DetailBox from "@/components/commonComponents/productBox/Job3DetailBox";
import CommonHeader from "@/components/themes/common/CommonHeader";
import { LatestJobOpenings } from "@/constants";
import { LatestJobOpeningsContent } from "@/data/demo/jobDemo2";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { Button, Col, Container, Nav, NavItem, Row, TabContent, TabPane } from "reactstrap";

const JobOpening3 = () => {
  const [activeTab, setActiveTab] = useState("part_time");
  const { productItem, categoryItem } = useAppSelector((state) => state.product);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <section className='job-box-section section-b-space position-relative'>
      <div className='circle-animation' />
      <Container>
        <div className='title-style-5'>
          <CommonHeader title={LatestJobOpenings} content={LatestJobOpeningsContent} headClass='title-style-5' />
          <Nav pills className='justify-content-center'>
            {categoryItem
              .filter(({ id }) => id >= 22 && id <= 28)
              .map((tab) => (
                <NavItem key={tab.id}>
                  <Button className={`nav-link ${tab.value === activeTab ? "active" : ""}`} onClick={() => handleTabClick(tab.value)}>
                    {tab.label}
                  </Button>
                </NavItem>
              ))}
          </Nav>
        </div>
        <TabContent activeTab={activeTab}>
          {categoryItem
            .filter(({ id }) => id >= 22 && id <= 28)
            .map((tab, i) => (
              <TabPane key={i} className={`fade ${tab.value === activeTab ? "show" : ""}`} tabId={tab.value}>
                <Row className='g-4'>
                  {productItem
                    .filter(({ jobType }) => jobType?.includes(activeTab))
                    .slice(0, 6)
                    .map((item, index) => {
                      return (
                        <Col xl={4} md={6} key={index} data-aos='fade-up' data-aos-duration={200 * (index + 1)}>
                          <Job3DetailBox data={item} activeTab={activeTab} />
                        </Col>
                      );
                    })}
                </Row>
              </TabPane>
            ))}
        </TabContent>
      </Container>
    </section>
  );
};

export default JobOpening3;

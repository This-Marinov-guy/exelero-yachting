import { BrowseCategoryTitle, JobCategoryTitle, SVGPath } from "@/constants";
import { BrowseCategoryData } from "@/data/pages/Others";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const BrowseCategory = () => {
  return (
    <section className='job-category-section car-about-category section-b-space'>
      <Container>
        <div className='title-style-3 text-center'>
          <h2>{JobCategoryTitle}</h2>
          <p>{BrowseCategoryTitle}</p>
        </div>
        <Row className='gy-4'>
          {BrowseCategoryData.map((item, i) => {
            return (
              <Col xl={3} lg={4} sm={6} key={i}>
                <div className='category-box'>
                  <img src={`${SVGPath}/${item.image}`} alt={`img-${i+1}`} className='img-fluid dot-img' />
                  <div className='category-icon'>
                   {item.icon}
                  </div>
                  <div className='category-title'>
                    <h4>{item.category}</h4>
                    <p>{item.description}</p>
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

export default BrowseCategory;

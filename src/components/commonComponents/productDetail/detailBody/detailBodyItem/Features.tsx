import { FeatureTitle } from "@/constants";
import { CarFeatures } from "@/data/car";
import React from "react";
import { Col, Row } from "reactstrap";

const Features = () => {
  return (
    <div className='detail-box' id="features">
      <h3 className='car-title'>{FeatureTitle}</h3>
      <Row className="g-md-4 g-3">
        {CarFeatures.map((section, index) => (
          <Col md={4} sm={6} key={index}>
            <div className='car-with-list'>
              <h5>{section.category}</h5>
              <ul className='feature-list'>
                {section.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Features;

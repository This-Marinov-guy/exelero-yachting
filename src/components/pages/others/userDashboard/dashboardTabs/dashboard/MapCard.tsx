import { ImagePath } from "@/constants";
import React from "react";
import { Col } from "reactstrap";

const MapCard = () => {
  return (
    <Col md={4}>
      <div className='map-card'>
        <img src={`${ImagePath}/other/map-card.jpg`} alt='map' className='img-fluid' />
      </div>
    </Col>
  );
};

export default MapCard;

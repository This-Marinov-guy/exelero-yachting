import { ImagePath } from "@/constants";
import { PortfolioTitle } from "@/types/Portfolio";
import RatioImage from "@/utils/RatioImage";
import React, { FC } from "react";
import { Col, Row } from "reactstrap";

const PortfolioDetailContent: FC<PortfolioTitle> = ({ title, darkMode, rightSide, data, image }) => {
  return (
    <Row className={` ratio3_2`}>
      <Col xs={12} className={`order-1 ${darkMode ? `col-md-7 ${!rightSide ? "order-md-0" : ""}` : `col-lg-7 ${!rightSide ? "order-lg-0" : ""}`}`}>
        <div className={darkMode ? "portfolio-content-box text-start" : "portfolio-detail-content"}>
          {darkMode && <span className='border-bg'></span>}
          <h2>{title}</h2>
          {darkMode ? (
            <p>{data}</p>
          ) : (
            data?.map((item, i) => {
              return (
                <ul className='portfolio-listing' key={i}>
                  <li>
                    <p>{item}</p>
                  </li>
                </ul>
              );
            })
          )}
        </div>
      </Col>
      <Col xs={12} className={darkMode ? "col-md-5" : "col-lg-5"}>
        <div className='portfolio-image '>
          <RatioImage src={`${ImagePath}/portfolio/detail-images/${image}.jpg`} alt='pd-3' className={`img-fluid bg-img`} />
        </div>
      </Col>
    </Row>
  );
};

export default PortfolioDetailContent;

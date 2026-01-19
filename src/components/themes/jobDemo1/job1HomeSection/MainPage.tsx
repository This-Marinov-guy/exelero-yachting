import { ImagePath, SVGPath } from "@/constants";
import { JobCounterData, JobHomeSectionData } from "@/data/demo/jobDemo1";
import { JobHomeType } from "@/types/HomeDemo";
import RatioImage from "@/utils/RatioImage";
import React from "react";
import CountUp from "react-countup";
import { Col, Row } from "reactstrap";

const MainPage = () => {
  const renderImage = (imageData: JobHomeType, key: string) => {
    const src = imageData.type === "svg" ? `${SVGPath}/${imageData.image}` : `${ImagePath}/${imageData.image}`;
    return <RatioImage key={key} src={src} alt={imageData.image} className={`img-fluid ${imageData.class || ""}`} />;
  };

  return (
    <div className="home-block-space">
      <Row className="align-items-center">
        <Col xl="7" lg="6">
          <div className="home-content">
            <h3>Build your future with us</h3>
            <h1>Find your job &amp; make sure goal.</h1>
            <p>Your dream job is waiting for you. Find the best real estate on your country. Your dream job is waiting for you. Find the best real estate on your country.</p>
            <ul className="counter-list">
              {JobCounterData.map((item, index) => (
                <li className="counter-box" key={`counter-${index}`}>
                  <div className="counter-info">
                    <h3>
                      <CountUp end={item.end} className="counter-count" delay={0} />
                      {item.suffix}
                    </h3>
                    <h4>{item.label}</h4>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col xl="5" lg="6">
          <div className="home-img">
            {JobHomeSectionData.map((item, index) => {
              if ("meanClass" in item) {
                return (
                  <div key={`meanClass-${index}`} className={item.meanClass}>
                    {item.multipleImage.map((imgData, imgIndex) => {
                      if ("childrenClass" in imgData) {
                        return (
                          <div key={`childrenClass-${index}-${imgIndex}`} className={imgData.childrenClass}>
                            {imgData.childrenImage.map((childImg, childIndex) =>
                              renderImage(childImg, `childImg-${index}-${imgIndex}-${childIndex}`)
                            )}
                          </div>
                        );
                      }
                      return renderImage(imgData, `imgData-${index}-${imgIndex}`);
                    })}
                  </div>
                );
              }
              return renderImage(item, `jobImage-${index}`);
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainPage;

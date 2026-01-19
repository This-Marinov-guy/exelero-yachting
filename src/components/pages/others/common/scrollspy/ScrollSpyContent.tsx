import { FC, useEffect } from "react";
import { Col } from "reactstrap";
import { ScrollspyType } from "../../../../../types/Other";
import SmoothScroll from "smooth-scroll";

const ScrollSpyContent: FC<ScrollspyType> = ({ content }) => {
  useEffect(() => {
    const scroll = new SmoothScroll('a[href*="#"]', {
      speed: 800,
      offset: 30,  
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <Col xxl="10" lg="9">
      <div className="scrollspy-section" style={{ position: "relative" }}>        
        <div>
          {content?.map((item, index) => (
            <div id={item.id} key={index} className="scrollspy-section" >
            {item.subsections ? (
              <h5 className="sub-title mt-lg-4 mt-3">{item.title}</h5>
            ) : (
              <h4 className="privacy-title">{item.title}</h4>
            )}
            <p>{item.content}</p>
            {item.subList && (
              <ul className="sub-list">
                {item.subList.map((subList, idx) => (
                  <li key={idx}>
                    <strong>{subList.title}</strong> {subList.content}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          ))}
        </div>
      </div>
    </Col>
  );
};

export default ScrollSpyContent;

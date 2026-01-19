import { EffectiveDate } from "@/constants";
import { ScrollspyType } from "@/types/Other";
import { FC, Fragment } from "react";
import { Container, Row } from "reactstrap";
import ScrollSpyContent from "./ScrollSpyContent";
import { BottomInfo } from "@/data/pages/Others";
import ScrollSpyNav from "./ScrollSpyNav";
 
const Scrollspy: FC<ScrollspyType> = ({ title, list, content }) => {
  return (
    <section className="privacy-section section-b-space">
      <Container>
        <h3 className="text-center">{title}</h3>
        <span className="privacy-date">
          <strong>{EffectiveDate}</strong> 25/05/2025
        </span>
        <Row>
          <ScrollSpyContent content={content} />
          <ScrollSpyNav list={list} />
          <ul className="bottom-information">
            {BottomInfo.map((info, index) => (
              <li key={index}>
                {info.isHeader ? (
                  <h5>{info.label}</h5>
                ) : (
                  <Fragment>
                    <strong>{info.label}</strong> {info.value}
                  </Fragment>
                )}
              </li>
            ))}
          </ul>
        </Row>
      </Container>
    </section>
  );
};

export default Scrollspy;

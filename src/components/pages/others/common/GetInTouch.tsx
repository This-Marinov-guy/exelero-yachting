import { AboutGetInTouchData } from "@/data/pages/Others";
import { FC, Fragment } from "react";
import { Col, Row } from "reactstrap";
import FollowUs from "./FollowUs";

interface GetInTouchProps {
  type?: 'contact-1' | 'contact-2' | 'contact-3';
}

const GetInTouch: FC<GetInTouchProps> = ({ type }) => {
  const renderContactBox = (
    item: (typeof AboutGetInTouchData)[0],
    iconAtBottom: boolean = false
  ) => (
    <>
      {!iconAtBottom && <div className="contact-icon">{item.icon}</div>}
      <div className="contact-info">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      {iconAtBottom && <div className="contact-icon">{item.icon}</div>}
    </>
  );

  if (type === "contact-1") {
    return (
      <Row className='gy-4'>
        {AboutGetInTouchData.map((item, i) => (
          <Col xxl={3} md={6} key={i}>
            <div className='contact-box'>
              {renderContactBox(item, true)}
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  if (type === "contact-2") {
    return (
      <Row className='gy-4'>
        {AboutGetInTouchData.map((item, i) => (
          <Col xl={3} lg={4} sm={6} key={i}>
            <div className='contact-box'>
              {renderContactBox(item)}
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  if (type === "contact-3") {
    return (
      <Fragment>
        <ul className='contact-list'>
          {AboutGetInTouchData.slice(0, 3).map((item, i) => (
            <li className='contact-box' key={i}>
              {renderContactBox(item)}
            </li>
          ))}
        </ul>
        <FollowUs />
      </Fragment>
    );
  }

  return null;
};

export default GetInTouch;

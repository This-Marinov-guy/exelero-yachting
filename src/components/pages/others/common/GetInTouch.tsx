import { AboutGetInTouchData } from "@/data/pages/Others";
import { FC, Fragment } from "react";
import { Col, Row } from "reactstrap";
import FollowUs from "./FollowUs";

interface GetInTouchProps {
  type?: 'contact-1' | 'contact-2' | 'contact-3';
}

const GetInTouch: FC<GetInTouchProps> = ({ type }) => {
  const getHref = (title: string, value: string) => {
    const t = title.toLowerCase();

    if (t.includes("contact") || t.includes("call") || t.includes("phone") || t.includes("number")) {
      const tel = value.replace(/[^\d+]/g, "");
      return `tel:${tel}`;
    }

    if (t.includes("email") || t.includes("mail")) {
      return `mailto:${value.trim()}`;
    }

    if (t.includes("location") || t.includes("address")) {
      const q = encodeURIComponent(value.trim());
      return `https://www.google.com/maps/search/?api=1&query=${q}`;
    }

    // Website (if present) - ensure protocol so it becomes clickable
    if (t.includes("website")) {
      const v = value.trim();
      if (!v) return "#";
      if (v.startsWith("http://") || v.startsWith("https://")) return v;
      return `https://${v}`;
    }

    return "#";
  };

  const renderContactBox = (
    item: (typeof AboutGetInTouchData)[0],
    iconAtBottom: boolean = false
  ) => (
    <>
      {!iconAtBottom && <div className="contact-icon">{item.icon}</div>}
      <div className="contact-info">
        <h3>{item.title}</h3>
        <p>
          <a
            href={getHref(item.title, item.description)}
            target={item.title.toLowerCase().includes("location") || item.title.toLowerCase().includes("website") ? "_blank" : undefined}
            rel={item.title.toLowerCase().includes("location") || item.title.toLowerCase().includes("website") ? "noreferrer" : undefined}
          >
            {item.description}
          </a>
        </p>
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
      <Row className='gy-4 justify-content-center'>
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

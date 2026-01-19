import { Href } from "@/constants";
import { PrivacyData } from "@/data/pages/Others";
import Link from "next/link";
import { Col, Row } from "reactstrap";
import SwitchItem from "../common/SwitchItem";

const Privacy = () => {
  return (
    <Row>
      {PrivacyData.map((item, index) => (
        <Col xs='12' key={index}>
          <div className="common-card">
            <div className='white-card'>
              <h4 className='dashboard-title'>{item.title}</h4>
              {item.switchItem.map((switchItem, index) => (
                <SwitchItem title={switchItem.title} description={switchItem.description} checked={switchItem.checked ? true : false} key={index} />
              ))}
              <Link scroll={false} href={Href} className='btn-solid'>
                {item.btnLabel}
              </Link>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Privacy;

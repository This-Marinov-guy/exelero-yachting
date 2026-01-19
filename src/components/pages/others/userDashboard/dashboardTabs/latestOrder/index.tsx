import { LatestOrderTitle, SVGPath } from "@/constants";
import { LatestOrderCategories, OrderTabData } from "@/data/pages/Others";
import Image from "next/image";
import { useState } from "react";
import { Button, Col, Nav, NavItem, TabContent, TabPane, Tooltip } from "reactstrap";
import TableOrder from "./TableOrder";

const LatestOrder = () => {
  const [activeTab, setActiveTab] = useState("sedan");
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Col xl={7}>
      <div className='white-card'>
        <h4 className='dashboard-inner-title'>{LatestOrderTitle}</h4>
        <Nav pills>
          {LatestOrderCategories.map((item, i) => {
            return (
              <NavItem key={i}>
                <Button id={item.id} className={`nav-link ${activeTab === item.id ? "active" : ""}`} color="transparent" onClick={() => setActiveTab(item.id)}>
                  <Image width={40} height={40} src={`${SVGPath}/${item.imgSrc}`} alt='sedan' className='img-fluid' />
                </Button>
                <Tooltip isOpen={!!tooltipOpen[item.id]} target={item.id} toggle={() => toggleTooltip(item.id)} placement='top'>
                  {item.title}
                </Tooltip>
              </NavItem>
            );
          })}
        </Nav>
        <TabContent activeTab={activeTab}>
          {OrderTabData.map((item, i) => {
            return (
              <TabPane key={i} tabId={item.id}>
                <TableOrder type={item.id} />
              </TabPane>
            );
          })}
        </TabContent>
      </div>
    </Col>
  );
};

export default LatestOrder;

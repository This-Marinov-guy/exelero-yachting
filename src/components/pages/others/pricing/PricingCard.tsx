import CommonHeader from "@/components/themes/common/CommonHeader";
import { PricingTitle } from "@/constants";
import { PricingDescription, PricingPlans } from "@/data/pages/Others";
import { Button, Col, Container, Row } from "reactstrap";

const PricingCard = () => {
  return (
    <section className='pricing-section'>
      <Container>
        <CommonHeader title={PricingTitle} content={PricingDescription} headClass='content-title' />
        <Row className='gy-xl-0 gy-4 justify-content-center'>
          {PricingPlans.map((plan) => (
            <Col xl={4} md={6} key={plan.id} className={`${plan.isActive ? "active" : ""}`}>
              <div className={`pricing-box ${plan.isActive ? "active" : ""}`}>
                <div className='d-flex align-items-center gap-2 justify-content-between'>
                  <h4>{plan.title}</h4>
                  {plan.isPopular && <label>{plan.popularLabel}</label>}
                </div>
                <p>{plan.description}</p>
                <h2>
                  {plan.price} {plan.priceNote && <span>{plan.priceNote}</span>}
                </h2>
                <ul className='pricing-list'>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className='ri-check-double-line' />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button color='transparent' className='btn-border'>
                  {plan.buttonLabel}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PricingCard;

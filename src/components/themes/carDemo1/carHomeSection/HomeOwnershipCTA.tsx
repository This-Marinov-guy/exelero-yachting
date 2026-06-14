import React from "react";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { RouteList } from "@/utils/RouteList";
import { ArrowRight } from "lucide-react";

const HomeOwnershipCTA = () => {
  return (
    <section className="exelero-ownership-cta section-t-space section-b-space">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <div className="ownership-cta-content" data-aos="fade-up" data-aos-duration={600}>
              <p className="ownership-cta-eyebrow">Our Approach</p>
              <h2 className="ownership-cta-title">
                Specialising in the facilitation of yacht ownership with end-to-end support
              </h2>
              <p className="ownership-cta-text">
                With over two decades of experience in the yachting world, we listen, understand, and guide each client
                toward the right yacht for their needs. From first enquiry through to sea trials and beyond — we are
                with you every step of the way.
              </p>
              <Link href={RouteList.Pages.Other.ContactUs1} className="ownership-cta-btn">
                Get in touch <ArrowRight size={18} />
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeOwnershipCTA;

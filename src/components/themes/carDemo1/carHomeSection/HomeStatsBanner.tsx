import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import { RouteList } from "@/utils/RouteList";

const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "500+", label: "Yachts Delivered" },
  { value: "5", label: "Leading Brands" },
  { value: "100%", label: "Relationship-Led" },
];

const HomeStatsBanner = () => {
  return (
    <section className="exelero-stats-banner">
      <div className="stats-banner-bg" aria-hidden="true">
        <Image
          src="/assets/images/hero/boats.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={72}
          className="stats-banner-img"
          style={{ objectFit: "cover" }}
        />
        <div className="stats-banner-overlay" />
      </div>

      <Container className="stats-banner-inner">
        <Row className="g-4 g-lg-0">
          <Col lg={6} className="stats-banner-left" data-aos="fade-right" data-aos-duration={600}>
            <h2 className="stats-banner-title">
              A relationship-led approach to yacht ownership
            </h2>
            <p className="stats-banner-text">
              We believe every owner deserves expert, honest guidance — not just a sale. Our approach is built on trust,
              knowledge, and genuine care for your sailing future.
            </p>
            <Link href={RouteList.Pages.Other.ContactUs1} className="stats-banner-btn">
              Start the Conversation
            </Link>
          </Col>

          {/* <Col lg={6} data-aos="fade-left" data-aos-duration={600}>
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </Col> */}
        </Row>
      </Container>
    </section>
  );
};

export default HomeStatsBanner;

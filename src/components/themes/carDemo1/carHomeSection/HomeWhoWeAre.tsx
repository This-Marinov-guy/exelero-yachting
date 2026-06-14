import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { Sailboat, ShieldCheck, Handshake } from "lucide-react";
import { RouteList } from "@/utils/RouteList";

const highlights = [
  {
    icon: Sailboat,
    title: "Listening First",
    text: "We take the time to understand your sailing goals, lifestyle, and budget before making any recommendation.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Partners",
    text: "Representing only the brands we believe in — quality-first relationships built over decades.",
  },
  {
    icon: Handshake,
    title: "Full Ownership Journey",
    text: "From first enquiry to sea trials, surveys, and beyond — we are with you at every stage.",
  },
];

const HomeWhoWeAre = () => {
  return (
    <section className="exelero-who-we-are section-t-space mt-6 section-b-space">
      <Container>
        <Row className="align-items-center g-4 g-lg-5">
          <Col lg={6} data-aos="fade-right" data-aos-duration={600}>
            <div className="who-we-are-images">
              <div className="who-primary-img">
                <Image
                  src="/assets/images/other/about/general.jpg"
                  alt="Exelero Yachting team"
                  fill
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className="who-img"
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* <div className="who-secondary-img">
                <Image
                  src="/assets/images/hero/krasi.jpg"
                  alt="Yacht on the water"
                  fill
                  className="who-img"
                  style={{ objectFit: "cover" }}
                />
              </div> */}
            </div>
          </Col>

          <Col lg={6} data-aos="fade-left" data-aos-duration={600}>
            <div className="who-we-are-content">
              {/* <p className="who-eyebrow">Who We Are</p> */}
              <h2 className="who-title">Guiding Every Owner Toward the Right Yacht</h2>
              <p className="who-text">
                Exelero Yachting is a premium yachting group with a focus on long-term relationships over short-term
                transactions. We listen, understand, and guide each client toward the yacht that is truly right for them.
              </p>

              <div className="who-highlights">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="who-highlight">
                      <div className="who-highlight-icon">
                        <Icon size={20} />
                      </div>
                      <div className="who-highlight-body">
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link href={RouteList.Pages.About} className="who-cta-link">
                Learn more about us
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeWhoWeAre;

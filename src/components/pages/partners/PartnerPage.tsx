"use client";
import { Partners, Partner } from "@/data/partners";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Col, Container, Row } from "reactstrap";
import { ArrowRight } from "iconsax-react";

const PartnerPage: React.FC = () => {
  const params = useParams();
  const partnerId = params?.["partnerId"];
  const partner: Partner | undefined = partnerId && typeof partnerId === "string" ? Partners[partnerId] : undefined;

  if (!partner) {
    return (
      <div className="partner-page">
        <Container>
          <div className="text-center py-5">
            <h1>Partner Not Found</h1>
            <p>The requested partner page could not be found.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="partner-page" style={{ "--partner-primary": partner.primaryColor, "--partner-secondary": partner.secondaryColor } as React.CSSProperties}>
      <div className="partner-hero-section">
        <div className="partner-hero-background">
          <Image
            src={partner.breadcrumbImage}
            alt={partner.name}
            fill
            className="partner-hero-image"
            priority
            style={{ objectFit: "cover" }}
          />
          <div className="partner-hero-overlay"></div>
        </div>
        <Container>
          <div className="partner-hero-content">
            <div className="partner-logo-wrapper">
              <Image
                src={partner.logoImage}
                alt={`${partner.name} logo`}
                width={200}
                height={100}
                className="partner-logo"
                style={{ objectFit: "contain" }}
              />
            </div>
            <h1 className="partner-title">{partner.name}</h1>
          </div>
        </Container>
      </div>

      <Container>
        <div className="partner-content-section">
          <Row className="g-4">
            <Col lg={8}>
              <div className="partner-image-panel">
                <div className="partner-panel-image-wrapper">
                  <Image
                    src={partner.heroImage}
                    alt={partner.name}
                    fill
                    className="partner-panel-image"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="partner-description">
                <h2>About {partner.name}</h2>
                <p>{partner.description}</p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="partner-info-card">
                <h3>Partner Information</h3>
                <div className="partner-info-item">
                  <strong>Website:</strong>
                  {partner.website ? (
                    <Link href={partner.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </Link>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
                <div className="partner-cta">
                  <Link href={partner.affiliateLink} target="_blank" rel="noopener noreferrer">
                    <Button className="partner-button" style={{ backgroundColor: partner.primaryColor, borderColor: partner.primaryColor }}>
                      Explore {partner.name} <ArrowRight className="ms-2" size={20} />
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default PartnerPage;

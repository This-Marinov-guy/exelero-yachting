import type { Partner } from "@/types/Partner";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { ArrowRight } from "lucide-react";
import PartnerInquiryForm from "./PartnerInquiryForm";

export default function PartnerPage({ partner }: { partner: Partner }) {
  return (
    <div className="partner-page" style={{ "--partner-primary": partner.primary_color, "--partner-secondary": partner.secondary_color } as React.CSSProperties}>
      <div className="partner-hero-section">
        <div className="partner-hero-background">
          <Image src={partner.breadcrumb_image_url} alt="" fill className="partner-hero-image" priority style={{ objectFit: "cover" }} unoptimized={partner.breadcrumb_image_url.startsWith("http")} />
          <div className="partner-hero-overlay" />
        </div>
        <Container><div className="partner-hero-content">
          <div className="partner-logo-wrapper"><Image src={partner.logo_url} alt={`${partner.name} logo`} width={200} height={100} className="partner-logo" style={{ objectFit: "contain" }} unoptimized={partner.logo_url.startsWith("http")} /></div>
          <h1 className="visually-hidden">{partner.name}</h1>
        </div></Container>
      </div>
      <Container><div className="partner-content-section"><Row className="g-4">
        <Col lg={8}>
          {partner.hero_image_url && <div className="partner-image-panel"><div className="partner-panel-image-wrapper"><Image src={partner.hero_image_url} alt={partner.name} fill className="partner-panel-image" style={{ objectFit: "cover" }} unoptimized={partner.hero_image_url.startsWith("http")} /></div></div>}
          <div className="partner-description"><h2>About {partner.name}</h2>{partner.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </Col>
        <Col lg={4}>
          <div className="partner-info-card">
            <h3>Get in touch</h3>
            <PartnerInquiryForm partner={partner} />
            {partner.website_url && <div className="partner-cta"><Link href={partner.website_url} target="_blank" rel="noopener noreferrer" className="partner-button btn d-inline-flex align-items-center justify-content-center" style={{ backgroundColor: partner.primary_color, borderColor: partner.primary_color }}>Visit {partner.name} <ArrowRight className="ms-2" size={18} /></Link></div>}
          </div>
        </Col>
      </Row></div></Container>
    </div>
  );
}

import type { Partner } from "@/types/Partner";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { ArrowRight } from "lucide-react";
import PartnerInquiryForm from "./PartnerInquiryForm";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicText } from "@/lib/publicText";
import type { PartnerFormField } from "@/types/Partner";

export default async function PartnerPage({ partner, englishFields }: { partner: Partner; englishFields: PartnerFormField[] }) {
  const locale = await getServerPublicLocale();
  const t = (value: string) => publicText(locale, value);
  return (
    <div className="partner-page" style={{ "--partner-primary": partner.primary_color, "--partner-secondary": partner.secondary_color } as React.CSSProperties}>
      <div className="partner-hero-section">
        <div className="partner-hero-background">
          <Image src={partner.breadcrumb_image_url} alt="" fill sizes="100vw" quality={72} className="partner-hero-image" priority style={{ objectFit: "cover" }} />
          <div className="partner-hero-overlay" />
        </div>
        <Container><div className="partner-hero-content">
          <div className="partner-logo-wrapper"><Image src={partner.logo_url} alt={`${partner.name} ${t("logo")}`} width={200} height={100} sizes="200px" className="partner-logo" style={{ objectFit: "contain" }} /></div>
          <h1 className="visually-hidden">{partner.name}</h1>
        </div></Container>
      </div>
      <Container><div className="partner-content-section"><Row className="g-4">
        <Col lg={8}>
          {partner.hero_image_url && <div className="partner-image-panel"><div className="partner-panel-image-wrapper"><Image src={partner.hero_image_url} alt={partner.name} fill sizes="(max-width: 991px) 100vw, 66vw" quality={72} className="partner-panel-image" style={{ objectFit: "cover" }} /></div></div>}
          <div className="partner-description"><h2>{t("About partner")} {partner.name}</h2>{partner.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </Col>
        <Col lg={4} className="partner-contact-column">
          <div className="partner-info-card">
            <h3>{t("Get in Touch")}</h3>
            <PartnerInquiryForm partner={partner} englishFields={englishFields} />
            {partner.website_url && <div className="partner-cta"><Link href={partner.website_url} target="_blank" rel="noopener noreferrer" className="partner-button btn d-inline-flex align-items-center justify-content-center" style={{ backgroundColor: partner.primary_color, borderColor: partner.primary_color }}>{t("Visit")} {partner.name} <ArrowRight className="ms-2" size={18} /></Link></div>}
          </div>
        </Col>
      </Row></div></Container>
    </div>
  );
}

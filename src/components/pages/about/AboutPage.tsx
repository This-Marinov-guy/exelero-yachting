import { RouteList } from "@/utils/RouteList";
import { getPublishedPartners } from "@/lib/partners";
import { Handshake, Sailboat, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import AboutBrochureActions from "./AboutBrochureActions";

const commitments = [
  {
    icon: ShieldCheck,
    title: "Quality above quantity",
    description: "We do not make empty promises or hide behind terms and conditions. We guarantee our products and stand behind them.",
  },
  {
    icon: Handshake,
    title: "Trusted Partners",
    description: "The brands and specialists we work with are selected because they are proven world-class enterprises.",
  },
  {
    icon: Sailboat,
    title: "Full Support",
    description: "From inquiry to first voyage and service, we provide a complete 360° customer experience.",
  },
];

const services = [
  { title: "New Yachts Dealership", lines: ["New Yachts", "Dealership"], href: RouteList.Pages.NewYachts },
  { title: "Pre-owned Yachts", lines: ["Pre-owned", "Yachts"], href: RouteList.Pages.PreOwnedYachts },
  { title: "Yacht Transportation", lines: ["Yacht", "Transportation"], href: RouteList.Pages.Services.Transportation },
  { title: "Yacht Charters", lines: ["Yacht", "Charters"], href: RouteList.Pages.Charters },
];

const transparentLogoBySource: Record<string, string> = {
  "/assets/images/logo/udeck.png": "/assets/images/logo/udeck-transparent.png",
  "/assets/images/logo/elvstrom-sailwear.webp": "/assets/images/logo/elvstrom-sails-transparent.png",
};

const experience = [
  {
    years: "32 years",
    description: "Sailing experience in dinghies, Olympic classes, and inshore and offshore racing. Rolex Middle Sea Race ORC winner in 2023 and IRC European champion in 2025.",
  },
  {
    years: "10 years",
    description: "Team principal of Yacht Club Port Bourgas, one of Bulgaria's most recognised yacht clubs.",
  },
  {
    years: "5 years",
    description: "Racing team manager, including the 2023 Rolex Middle Sea Race ORC win, the 2025 IRC European championship, second place at Giraglia 2025, and multinational championships.",
  },
];

const AboutPage = async () => {
  const partners = await getPublishedPartners();

  return <main className="exelero-about-section">
      <Container>
        <div className="about-masthead">
          <h1>Premium Yachting<br />Experience</h1>
        </div>

        <section className="about-overview" aria-labelledby="about-intro-title">
          <div className="about-overview__copy">
            <h2 id="about-intro-title">About Us</h2>
            <p>At Exelero Yachting we specialise in a personalised customer approach. We carefully gather information about our clients' requirements and make recommendations. We are adamant that every customer must make an informed choice.</p>
            <p>For this purpose we only work with prestigious brands that have proven themselves in both quality and customer service. We would not recommend a product that we would not purchase ourselves. We believe that, in the long run, quality is what brings high value to customers. We make no compromises.</p>
          </div>
          <div className="about-commitments" aria-label="Our commitments">
            {commitments.map(({ icon: Icon, title, description }) => (
              <div className="about-commitment" key={title}>
                <Icon className="about-commitment__icon" size={28} strokeWidth={1.8} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-services" aria-labelledby="about-services-title">
          <h2 id="about-services-title">Our Services</h2>
          <div className="about-services__grid">
            {services.map(({ title, lines, href }) => (
              <Link key={title} href={href} aria-label={title}>
                <span>{lines[0]}<br />{lines[1]}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="about-partners" aria-labelledby="about-partners-title">
          <h2 id="about-partners-title">Our Partners</h2>
          <p>We collaborate with leading brands to deliver exceptional results.</p>
          <div className="about-partners__grid">
            {partners.map(({ name, slug, logo_url }) => {
              const logo = transparentLogoBySource[logo_url] ?? logo_url;

              return <Link className={`partner-card${logo_url === "/assets/images/logo/zhik.svg" ? " partner-card--zhik" : ""}`} href={`/partners/${slug}`} key={slug} aria-label={`Explore ${name}`}>
                <Image src={logo} alt={`${name} logo`} width={220} height={120} sizes="(max-width: 575px) 45vw, (max-width: 991px) 22vw, 14vw" unoptimized={logo.startsWith("http")} />
              </Link>;
            })}
          </div>
        </section>

        <section className="about-director" aria-labelledby="about-director-title">
          <h2 id="about-director-title">Our Director</h2>
          <div className="about-director__body">
            <div className="about-director__image">
              <Image src="/assets/images/hero/krasi.jpg" alt="Krasimir Naumov, Founder and Director" width={500} height={570} sizes="(max-width: 767px) 100vw, 34vw" />
            </div>
            <div className="about-director__copy">
              <h3>Krasimir Naumov</h3>
              <p className="about-director__role">Founder &amp; Director</p>
              <p>After a long corporate career as a financial executive, I decided to turn to yachting and turn my love for it into my business. I want to help other people experience the great way of life that yachting offers.</p>
              <p>I have been sailing since I was six years old. For 32 years I have been connected with the industry as a sailor, and now it is the joy of my life to provide products that help others enjoy their lives more or build a business.</p>
            </div>
          </div>
        </section>

        <section className="about-experience" aria-labelledby="about-experience-title">
          <h2 id="about-experience-title">Experience &amp; Qualifications</h2>
          <div className="about-experience__list">
            {experience.map(({ years, description }) => (
              <div className="about-experience__item" key={years}>
                <strong>{years}</strong>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-guarantee" aria-labelledby="about-guarantee-title">
          <h2 id="about-guarantee-title">Our Guarantee</h2>
          <p>Outstanding quality and unwavering support.</p>
        </section>

        <section className="about-brochure" aria-labelledby="about-brochure-title">
          <div>
            <h2 id="about-brochure-title">Company profile</h2>
            <p>Download the brochure or share it with someone planning their next voyage.</p>
          </div>
          <AboutBrochureActions />
        </section>
      </Container>
  </main>;
};

export default AboutPage;

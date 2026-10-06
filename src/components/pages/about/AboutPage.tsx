import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import { Handshake, Sailboat, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import AboutBrochureActions from "./AboutBrochureActions";

const commitments = [
  {
    title: "Quality above quantity",
    description: "We do not make empty promises or hide behind terms and conditions. We guarantee our products and stand behind them.",
    icon: ShieldCheck,
  },
  {
    title: "Trusted Partners",
    description: "The brands and specialists we work with are selected because they are proven world-class enterprises.",
    icon: Handshake,
  },
  {
    title: "Full Support",
    description: "From inquiry to first voyage and service, we provide a complete 360° customer experience.",
    icon: Sailboat,
  },
];

const services = [
  { title: "New Yachts Dealership", href: RouteList.Pages.NewYachts },
  { title: "Pre-owned Yachts", href: RouteList.Pages.PreOwnedYachts },
  { title: "Yacht Transportation", href: RouteList.Pages.Services.Transportation },
  { title: "Yacht Charters", href: RouteList.Pages.Charters },
];

const partners = [
  { name: "X-Yachts", logo: "/assets/images/logo/x-yachts.png", href: RouteList.Pages.Partners.XYachts },
  { name: "Omaya Yachts", logo: "/assets/images/logo/omaya-yachts.jpg", href: RouteList.Pages.Partners.OmayaYachts },
  { name: "Elvstrom", logo: "/assets/images/logo/elvstrom.png", href: RouteList.Pages.Partners.Elvstrom },
  { name: "Zhik", logo: "/assets/images/logo/zhik.jpg", href: RouteList.Pages.Partners.Zhik },
  { name: "Spinlock", logo: "/assets/images/logo/spinlock.svg", href: RouteList.Pages.Partners.Spinlock },
];

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

const AboutPage = () => (
  <>
    <Breadcrumbs title="About Us" url={RouteList.Home.CarDemo1} mainClass="page-breadcrumbs-section" image />

    <main className="exelero-about-section section-b-space">
      <Container>
        <section className="about-intro" aria-labelledby="about-intro-title">
          <div className="about-intro__copy">
            <p className="about-eyebrow">Exelero Yachting</p>
            <h1 id="about-intro-title" className="about-title">Premium Yachting Experience</h1>
            <h2>About Us</h2>
            <p>At Exelero Yachting we specialise in a personalised customer approach. We carefully gather information about our clients' requirements and make recommendations. We are adamant that every customer must make an informed choice.</p>
            <p>For this purpose we only work with prestigious brands that have proven themselves in both quality and customer service. We would not recommend a product that we would not purchase ourselves. We believe that, in the long run, quality is what brings high value to customers. We make no compromises.</p>
          </div>
          <div className="about-intro__image">
            <Image src="/assets/images/other/about/general.jpg" alt="Sailing yacht at the marina" width={900} height={700} sizes="(max-width: 991px) 100vw, 48vw" priority />
          </div>
        </section>

        <section className="about-commitments" aria-label="Our commitments">
          {commitments.map(({ title, description, icon: Icon }) => (
            <div className="about-commitment" key={title}>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </section>

        <section className="about-services" aria-labelledby="about-services-title">
          <h2 id="about-services-title">Our Services</h2>
          <div className="about-services__grid">
            {services.map(({ title, href }) => <Link key={title} href={href}>{title}</Link>)}
          </div>
        </section>

        <section className="about-partners" aria-labelledby="about-partners-title">
          <h2 id="about-partners-title">Our Partners</h2>
          <p>We collaborate with leading brands to deliver exceptional results.</p>
          <div className="about-partners__grid">
            {partners.map(({ name, logo, href }) => (
              <Link className="partner-card" href={href} key={name} aria-label={`Explore ${name}`}>
                <Image src={logo} alt={`${name} logo`} width={220} height={120} sizes="(max-width: 575px) 45vw, (max-width: 991px) 30vw, 18vw" />
              </Link>
            ))}
          </div>
        </section>

        <section className="about-director" aria-labelledby="about-director-title">
          <div className="about-director__image">
            <Image src="/assets/images/hero/krasi.jpg" alt="Krasimir Naumov, Founder and Director" width={900} height={620} sizes="(max-width: 991px) 100vw, 40vw" />
          </div>
          <div className="about-director__copy">
            <p className="about-eyebrow">Management</p>
            <h2 id="about-director-title">Our Director</h2>
            <h3>Krasimir Naumov</h3>
            <p className="about-director__role">Founder &amp; Director</p>
            <p>After a long corporate career as a financial executive, I decided to turn to yachting and turn my love for it into my business. I want to help other people experience the great way of life that yachting offers.</p>
            <p>I have been sailing since I was six years old. For 32 years I have been connected with the industry as a sailor, and now it is the joy of my life to provide products that help others enjoy their lives more or build a business.</p>
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

        <section className="about-contact" aria-labelledby="about-contact-title">
          <h2 id="about-contact-title">Contact Exelero Yachting</h2>
          <div className="about-contact__grid">
            <div><h3>Call</h3><a href="tel:+359884967244">+359 884967244</a></div>
            <div><h3>Email</h3><a href="mailto:info@exelero.eu">info@exelero.eu</a></div>
            <div><h3>Location</h3><p>1 Alexander Battenberg blvd.<br />8000 Burgas, Bulgaria</p></div>
          </div>
          <a href="https://exeleroyachting.com" className="about-contact__website">exeleroyachting.com</a>
        </section>

        <section className="about-brochure" aria-labelledby="about-brochure-title">
          <div>
            <p className="about-eyebrow">Company profile</p>
            <h2 id="about-brochure-title">Keep the full story close</h2>
            <p>Download the brochure or share it with someone planning their next voyage.</p>
          </div>
          <AboutBrochureActions />
        </section>
      </Container>
    </main>
  </>
);

export default AboutPage;

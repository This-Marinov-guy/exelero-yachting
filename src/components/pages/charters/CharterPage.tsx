import CharterRequestSection from "./CharterRequestSection";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";

const CHARTER_ROWS = [
  {
    title: "Sailing Charters",
    description:
      "Explore the coast with our hand-picked sailing yachts. From day trips to week-long cruises, we match you with the right boat and skipper for your experience.",
    image: "/assets/images/filter/charter.jpg",
    imageAlt: "Sailing charter",
  },
  {
    title: "Luxury & Comfort",
    description:
      "Premium vessels with full amenities. Ideal for families and groups who want space, comfort, and professional crew support for a stress-free journey.",
    image: "/assets/images/hero/boats.jpg",
    imageAlt: "Luxury yacht",
  },
  {
    title: "Custom Itineraries",
    description:
      "Tell us your dream route and dates. We handle boat selection, crew, and logistics so you can focus on the sailing and the views.",
    image: "/assets/images/other/about/general.jpg",
    imageAlt: "Custom charter",
  },
];

const CharterPage = () => {
  return (
    <>
      {/* <Breadcrumbs
        title="Charters"
        url={RouteList.Home.CarDemo1}
        mainClass="page-breadcrumbs-section"
        image
      /> */}

      {/* Hero with full-bleed bg + glass panel */}
      <section className="charter-hero">
        <div className="charter-hero__bg" aria-hidden />
        <div className="charter-hero__noise" aria-hidden />
        <Container>
          <div className="charter-hero__glass charter-hero__glass--center">
            <span className="charter-hero__label">Charters</span>
            <h1 className="charter-hero__title">Yacht & Sailing Charters</h1>
            <p className="charter-hero__description">
              Whether you want a day sail, a week along the coast, or a fully crewed experience,
              we arrange charters that fit your style and schedule.
            </p>
            <div className="charter-hero__line" />
          </div>
        </Container>
      </section>

      {/* Content rows */}
      <section className="charter-content section-b-space">
        <Container>
          <p className="charter-content__intro">What we offer</p>
          {CHARTER_ROWS.map((row, index) => (
            <Row
              key={index}
              className={`charter-row align-items-center g-4 g-lg-5 ${index % 2 === 1 ? "charter-row--reverse" : ""}`}
            >
              <Col lg={6}>
                <div className="charter-row__image-wrap">
                  <span className="charter-row__index" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                  <Image
                    src={row.image}
                    alt={row.imageAlt}
                    width={640}
                    height={400}
                    className="charter-row__image img-fluid"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="charter-row__content charter-row__card">
                  <h2 className={`charter-row__title ${index % 2 === 1 ? "text-start" : "text-end"}`}>{row.title}</h2>
                  <p className="charter-row__text">{row.description}</p>
                </div>
              </Col>
            </Row>
          ))}
        </Container>
      </section>

      {/* Sticky CTA + form (client component: button visibility, form) */}
      <CharterRequestSection />
    </>
  );
};

export default CharterPage;

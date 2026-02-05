import CharterRequestSection from "./CharterRequestSection";
import Image from "next/image";
import { Container } from "reactstrap";

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
            <span className="charter-hero__label">Services</span>
            <h1 className="charter-hero__title">Yacht & Sailing Charters</h1>
            {/* <p className="charter-hero__description">
              Whether you want a day sail, a week along the coast, or a fully crewed experience,
              we arrange charters that fit your style and schedule.
            </p> */}
            <div className="charter-hero__line" />
          </div>
        </Container>
      </section>

      {/* Bento grid content */}
      <section className="charter-content section-b-space mt-5">
        <Container>
          <div className="charter-bento">
            <article className="charter-bento__cell charter-bento__cell--large">
              <div className="charter-bento__image-wrap">
                <Image
                  src={CHARTER_ROWS[0].image}
                  alt={CHARTER_ROWS[0].imageAlt}
                  width={800}
                  height={500}
                  className="charter-bento__image img-fluid"
                />
              </div>
              <div className="charter-bento__card">
                <h2 className="charter-bento__title">{CHARTER_ROWS[0].title}</h2>
                <p className="charter-bento__text">{CHARTER_ROWS[0].description}</p>
              </div>
            </article>
            <article className="charter-bento__cell charter-bento__cell--small">
              <div className="charter-bento__image-wrap charter-bento__image-wrap--small">
                <Image
                  src={CHARTER_ROWS[1].image}
                  alt={CHARTER_ROWS[1].imageAlt}
                  width={400}
                  height={280}
                  className="charter-bento__image img-fluid"
                />
              </div>
              <div className="charter-bento__card charter-bento__card--small">
                <h2 className="charter-bento__title">{CHARTER_ROWS[1].title}</h2>
                <p className="charter-bento__text">{CHARTER_ROWS[1].description}</p>
              </div>
            </article>
            <article className="charter-bento__cell charter-bento__cell--small">
              <div className="charter-bento__image-wrap charter-bento__image-wrap--small">
                <Image
                  src={CHARTER_ROWS[2].image}
                  alt={CHARTER_ROWS[2].imageAlt}
                  width={400}
                  height={280}
                  className="charter-bento__image img-fluid"
                />
              </div>
              <div className="charter-bento__card charter-bento__card--small">
                <h2 className="charter-bento__title">{CHARTER_ROWS[2].title}</h2>
                <p className="charter-bento__text">{CHARTER_ROWS[2].description}</p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* Sticky CTA + form (client component: button visibility, form) */}
      <CharterRequestSection />
    </>
  );
};

export default CharterPage;

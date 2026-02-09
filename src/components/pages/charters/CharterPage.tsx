import HeroParallaxSection from "@/components/commonComponents/HeroParallaxSection";
import CharterRequestSection from "./CharterRequestSection";
import Image from "next/image";
import { Container } from "reactstrap";
import CharterSkipperTabs from "./CharterSkipperTabs";
import CharterInfoTabs from "./CharterInfoTabs";

const CHARTER_ROWS = [
  {
    title: "Sailing Charters",
    description:
      "Explore the coast with our hand-picked sailing yachts. From day trips to week-long cruises, we match you with the right boat and skipper for your experience.",
    image: "/assets/images/charter/cruiser.webp",
    imageAlt: "Sailing charter",
  },
  {
    title: "Variety on demand",
    description:
      "Choose from a range of vessels, from small cruisers to large racing yachts. We can provide a boat for every occasion from cruisers, racing yachts to power boats. Holiday or Racing, we have you covered.",
    image: "/assets/images/charter/racing.jpg",
    imageAlt: "Luxury yacht",
  },
  {
    title: "Custom Itineraries",
    description:
      "Tell us your dream route and dates. We handle boat selection, crew, and logistics so you can focus on the sailing and the views.",
    video: "/assets/images/charter/yacht.mp4",
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

      {/* Hero with full-bleed bg + glass panel (bg scrolls slower = parallax) */}
      <HeroParallaxSection heroClass="charter-hero">
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
      </HeroParallaxSection>

      {/* Bento grid content */}
      <section className="charter-content section-b-space mt-5">
        <Container>
          <div className="charter-bento">
            <article className="charter-bento__cell charter-bento__cell--large">
              <div className="charter-bento__card">
                {/* <p className="charter-bento__text">
                  From relaxed coastal cruising to performance-oriented passages, our charter partners
                  offer a curated fleet of yachts ready to match your experience level, crew size, and
                  dream itinerary.
                </p> */}

                {/* Info tabs: who / when & where / boats */}
                <CharterInfoTabs />

                {/* Skipper options tabs */}
                <CharterSkipperTabs />

                <div className="charter-bento__image-wrap">
                  <Image
                    src={CHARTER_ROWS[0].image!}
                    alt={CHARTER_ROWS[0].imageAlt}
                    width={800}
                    height={500}
                    className="charter-bento__image img-fluid"
                  />
                </div>
              </div>
              
            </article>
            <article className="charter-bento__cell charter-bento__cell--small">
              <div className="charter-bento__image-wrap charter-bento__image-wrap--small">
                <Image
                  src={CHARTER_ROWS[1].image!}
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
                <video
                  src={CHARTER_ROWS[2].video}
                  className="charter-bento__image img-fluid"
                  muted
                  loop
                  playsInline
                  autoPlay
                  aria-label={CHARTER_ROWS[2].imageAlt}
                />
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

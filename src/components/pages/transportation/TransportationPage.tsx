import TransportationRequestSection from "./TransportationRequestSection";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";

const TRANSPORTATION_ROWS = [
  {
    title: "Boat & Yacht Transport",
    description:
      "We coordinate safe, professional transport for boats and yachts—from marina to marina or across regions. Our network of certified carriers and handlers ensures your vessel is in good hands.",
    image: "/assets/images/car/service-car.png",
    imageAlt: "Boat transportation",
  },
  {
    title: "Worldwide Logistics",
    description:
      "Whether you need delivery across the country or overseas, we handle permits, routing, and timing so you can focus on your next sail instead of the paperwork.",
    image: "/assets/images/hero/boats.jpg",
    imageAlt: "Logistics",
  },
  {
    title: "Expert Handling",
    description:
      "Cradles, covers, and experienced crews. We work with partners who specialize in boat transport so your yacht arrives ready for the water.",
    image: "/assets/images/other/about/general.jpg",
    imageAlt: "Expert handling",
  },
];

const TransportationPage = () => {
  return (
    <>
      {/* Hero with blue glass effect */}
      <section className="transportation-hero">
        <Container>
          <div className="transportation-hero__glass mt-5 text-center">
            <h1 className="transportation-hero__title">Boat & Yacht Transportation</h1>
          </div>
        </Container>
      </section>

      {/* Three rows: image/text alternating */}
      <section className="transportation-content section-b-space">
        <Container>
          {TRANSPORTATION_ROWS.map((row, index) => (
            <Row
              key={index}
              className={`transportation-row align-items-center g-4 g-lg-5 ${index % 2 === 1 ? "transportation-row--reverse" : ""}`}
            >
              <Col lg={6}>
                <div className="transportation-row__image-wrap">
                  <Image
                    src={row.image}
                    alt={row.imageAlt}
                    width={640}
                    height={400}
                    className="transportation-row__image img-fluid"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="transportation-row__content transportation-hero__glass transportation-hero__glass--static">
                  <h2 className={`transportation-row__title ${index % 2 === 1 ? "text-start" : "text-end"}`}>{row.title}</h2>
                  <p className="transportation-row__text">{row.description}</p>
                </div>
              </Col>
            </Row>
          ))}
        </Container>
      </section>

      {/* Sticky CTA + form (client component) */}
      <TransportationRequestSection />
    </>
  );
};

export default TransportationPage;

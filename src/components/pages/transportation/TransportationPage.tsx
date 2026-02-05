import TransportationRequestSection from "./TransportationRequestSection";
import Image from "next/image";
import { Container } from "reactstrap";
import { BadgeDollarSign, ArrowLeftRight, Zap } from "lucide-react";

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
      {/* Hero with full-bleed bg + glass panel */}
      <section className="transportation-hero">
        <div className="transportation-hero__bg" aria-hidden />
        <div className="transportation-hero__noise" aria-hidden />
        <Container>
          <div className="transportation-hero__glass transportation-hero__glass--center">
            <span className="transportation-hero__label">Services</span>
            <h1 className="transportation-hero__title">Boat & Yacht Transportation</h1>
            {/* <p className="transportation-hero__description">
              Safe, professional transport for boats and yachts—from marina to marina or across regions.
              We handle the logistics so you can focus on the water.
            </p> */}
            <div className="transportation-hero__line" />
          </div>

          {/* Bento grid content */}
          <section className="transportation-content section-b-space mt-5">
            <Container>
              <article className="transportation-bento__cell transportation-bento__cell--small transportation-bento__cell--small-row">
                <div className="transportation-bento__image-wrap transportation-bento__image-wrap--small transportation-bento__image-wrap--compact">
                  <Image
                    src={'/assets/images/transportation/delivery.jpg'}
                    alt={TRANSPORTATION_ROWS[2].imageAlt}
                    width={400}
                    height={280}
                    className="transportation-bento__image img-fluid"
                  />
                </div>
                <div className="transportation-bento__card transportation-bento__card--small">
                  <h2 className="transportation-bento__title mb-3">Worldwide Logistics</h2>
                  <p className="transportation-bento__text">We provide safe, reliable, and fully managed boat and yacht transportation services worldwide. From coastal deliveries to transoceanic shipments, our experienced team ensures your vessel is handled with precision, care, and complete attention to detail.
                  </p>
                  <br/>
                  <p className="transportation-bento__text">
                    Whether you are relocating a yacht, purchasing a vessel abroad, or planning seasonal movements, we coordinate every step of the journey—from route planning and permits to customs clearance and final delivery.
                  </p>
                </div>

                <div className="transportation-bento__labels" aria-label="Service highlights">
                  <div className="transportation-bento__label">
                    <ArrowLeftRight className="transportation-bento__label-icon" />
                    <span className="transportation-bento__label-text">end to end</span>
                  </div>
                  <div className="transportation-bento__label">
                    <BadgeDollarSign className="transportation-bento__label-icon" />
                    <span className="transportation-bento__label-text">flexible cost</span>
                  </div>
                  <div className="transportation-bento__label">
                    <Zap className="transportation-bento__label-icon" />
                    <span className="transportation-bento__label-text">fast service</span>
                  </div>
                </div>
              </article>
            </Container>
          </section>
        </Container>


      </section>



      {/* Sticky CTA + form (client component) */}
      <TransportationRequestSection />
    </>
  );
};

export default TransportationPage;

import TopFilter from "@/components/commonComponents/TopFilter";
import TransportationRequestSection from "./TransportationRequestSection";
import Image from "next/image";
import { Container } from "reactstrap";
import { BadgeDollarSign, ArrowLeftRight, Zap } from "lucide-react";

const TransportationPage = () => {
  return (
    <>
      <TopFilter
        title="Boat & Yacht Transportation"
      />

      <section className="transportation-layout section-b-space">
        <Container>
          <div className="transportation-layout__grid">
            {/* Left: information */}
            <div id="transportation-information" className="transportation-layout__info">
              <article className="transportation-bento__cell transportation-bento__cell--small">
                <div className="transportation-bento__image-wrap transportation-bento__image-wrap--small transportation-bento__image-wrap--compact">
                  <Image
                    src="/assets/images/transportation/delivery.jpg"
                    alt="Boat transportation"
                    width={400}
                    height={280}
                    className="transportation-bento__image img-fluid"
                  />
                </div>
                <div className="transportation-bento__card transportation-bento__card--small">
                  <h2 className="transportation-bento__title mb-3">Worldwide Logistics</h2>
                  <p className="transportation-bento__text">
                    We provide safe, reliable, and fully managed boat and yacht transportation services worldwide. From coastal deliveries to transoceanic shipments, our experienced team ensures your vessel is handled with precision, care, and complete attention to detail.
                  </p>
                  <br />
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
            </div>

            {/* Right: form */}
            <div className="transportation-layout__form">
              <TransportationRequestSection />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default TransportationPage;

import TopFilter from "@/components/commonComponents/TopFilter";
import TransportationRequestSection from "./TransportationRequestSection";
import Image from "next/image";
import { Container } from "reactstrap";
import { BadgeDollarSign, ArrowLeftRight, Zap } from "lucide-react";

const TransportationPage = () => {
  return (
    <>
      <TopFilter title="Yacht Transportation" image={null} />

      <section className="transportation-layout section-b-space">
        <Container>
          <div className="transportation-layout__grid">
            {/* Left: information */}
            <div id="transportation-information" className="transportation-layout__info">
              <article className="transportation-bento__cell transportation-bento__cell--small">
                <div className="transportation-bento__card transportation-bento__card--service">
                  <section className="transportation-service-section">
                    <h2 className="transportation-bento__title">Yacht Transport by Road</h2>
                    <p className="transportation-bento__text">
                      Moving a yacht over land takes more than a truck. It takes planning, the right equipment, and people who understand boats. We handle the entire process, so your yacht arrives safely and ready to launch.
                    </p>
                    <p className="transportation-bento__text">
                      <strong>Door-to-door service.</strong> We collect your boat from the yard, marina or factory and deliver it to your chosen destination anywhere in Europe, including Turkey, Serbia, Montenegro and Albania.
                    </p>
                    <p className="transportation-bento__text">
                      <strong>Everything included.</strong> Route planning, oversize-load permits, escort vehicles where required, lashing, shrink-wrapping, and transit insurance with full coverage.
                    </p>
                    <p className="transportation-bento__text">
                      <strong>12 Hour update basis.</strong> Route planning, oversize-load permits, escort vehicles where required, mast unstepping and packing, cradles, lashing, shrink-wrapping, and transit insurance.
                    </p>
                    <p className="transportation-bento__text">
                      <strong>Full price transparency.</strong> No hidden fees or surprises. What we quote for is what you pay.
                    </p>
                  </section>
                  <figure className="transportation-layout__photo">
                    <Image
                      src="/assets/images/transportation/transport.jpg"
                      alt="Sailing yacht secured on a road transport trailer at sunset"
                      width={1448}
                      height={1086}
                      sizes="(max-width: 991px) 100vw, 50vw"
                    />
                  </figure>
                  <section className="transportation-service-section">
                    <h2 className="transportation-bento__title">Yacht Transport by Sea</h2>
                    <p className="transportation-bento__text">
                      Our staff are certified RYA sailors with multiple ocean crossings who will deliver your yacht anywhere in the world with minimal risk to the boat&apos;s condition. We specialise in sailing yachts up to 65 FT and powerboats up to 100 FT.
                    </p>
                    <p className="transportation-bento__text">
                      We provide safe, reliable, and fully managed boat and yacht transportation services worldwide. From coastal deliveries to transoceanic shipments, our experienced team ensures your vessel is handled with precision, care, and complete attention to detail.
                    </p>
                  </section>
                </div>
              </article>
            </div>

            {/* Right: form */}
            <div className="transportation-layout__form" role="region" aria-label="Transportation request and service highlights" tabIndex={0}>
              <TransportationRequestSection />
              <ul className="transportation-bento__labels" aria-label="Service highlights">
                <li className="transportation-bento__label">
                  <ArrowLeftRight className="transportation-bento__label-icon" aria-hidden="true" />
                  <span className="transportation-bento__label-text">End to end</span>
                </li>
                <li className="transportation-bento__label">
                  <BadgeDollarSign className="transportation-bento__label-icon" aria-hidden="true" />
                  <span className="transportation-bento__label-text">Transparent pricing</span>
                </li>
                <li className="transportation-bento__label">
                  <Zap className="transportation-bento__label-icon" aria-hidden="true" />
                  <span className="transportation-bento__label-text">Fast service</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default TransportationPage;

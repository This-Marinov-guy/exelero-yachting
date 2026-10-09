import TopFilter from "@/components/commonComponents/TopFilter";
import TransportationRequestSection from "./TransportationRequestSection";
import CharterMediaPanel from "@/components/pages/charters/CharterMediaPanel";
import { Container } from "reactstrap";
import { BadgeDollarSign, ArrowLeftRight, Zap } from "lucide-react";
import type { TransportationPageContent, TransportationSection } from "@/lib/servicePageContent";

const TransportSection = ({ section }: { section: TransportationSection }) => (
  <section className="transportation-service-section">
    <h2 className="transportation-bento__title">{section.heading}</h2>
    {section.paragraphs.map((paragraph, index) => (
      <p key={index} className="transportation-bento__text">
        {paragraph.lead && <><strong>{paragraph.lead}</strong> </>}{paragraph.text}
      </p>
    ))}
  </section>
);

const TransportationPage = ({ content }: { content: TransportationPageContent }) => {
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
                  <TransportSection section={content.sections[0]} />
                  {content.media.gallery.length > 0 && <div className="transportation-layout__media">
                    <CharterMediaPanel key={content.media.gallery.map((item) => item.id).join(",")} media={content.media.gallery} contextLabel="Transportation" />
                  </div>}
                  <TransportSection section={content.sections[1]} />
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

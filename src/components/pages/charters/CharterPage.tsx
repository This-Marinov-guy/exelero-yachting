import TopFilter from "@/components/commonComponents/TopFilter";
import CharterRequestSection from "./CharterRequestSection";
import CharterMediaPanel from "./CharterMediaPanel";
import { Container } from "reactstrap";
import CharterSkipperTabs from "./CharterSkipperTabs";
import CharterInfoTabs from "./CharterInfoTabs";
import type { CharterPageContent } from "@/lib/servicePageContent";

const CharterPage = ({ content }: { content: CharterPageContent }) => {
  return (
    <>
      <TopFilter
        title="Yacht & Sailing Charters"
        image={content.media.banner?.src ?? null}
        imageAlt={content.media.banner?.alt}
      />

      <section className="charter-layout section-b-space">
        <Container>
          <div className="charter-layout__grid">
            {/* Left: information */}
            <div id="charter-information" className="charter-layout__info">
              <div className="charter-bento charter-bento--column">
                {content.media.gallery.length > 0 && <article className="charter-bento__cell">
                  <CharterMediaPanel key={content.media.gallery.map((item) => item.id).join(",")} media={content.media.gallery} />
                </article>}
                <article className="charter-bento__cell">
                  <div className="charter-bento__card">
                    <CharterInfoTabs tabs={content.infoTabs} />
                    <CharterSkipperTabs tabs={content.skipperOptions} />
                  </div>
                </article>
              </div>
            </div>

            {/* Right: form */}
            <div className="charter-layout__form" role="region" aria-label="Charter request form" tabIndex={0}>
              <CharterRequestSection />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CharterPage;

import TopFilter from "@/components/commonComponents/TopFilter";
import CharterRequestSection from "./CharterRequestSection";
import CharterMediaPanel from "./CharterMediaPanel";
import { Container } from "reactstrap";
import CharterSkipperTabs from "./CharterSkipperTabs";
import CharterInfoTabs from "./CharterInfoTabs";

const CharterPage = () => {
  return (
    <>
      <TopFilter
        title="Yacht & Sailing Charters"
      />

      <section className="charter-layout section-b-space">
        <Container>
          <div className="charter-layout__grid">
            {/* Left: information */}
            <div id="charter-information" className="charter-layout__info">
              <div className="charter-bento charter-bento--column">
                <article className="charter-bento__cell">
                  <CharterMediaPanel />
                </article>
                <article className="charter-bento__cell">
                  <div className="charter-bento__card">
                    <CharterInfoTabs />
                    <CharterSkipperTabs />
                  </div>
                </article>
              </div>
            </div>

            {/* Right: form */}
            <div className="charter-layout__form">
              <CharterRequestSection />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CharterPage;

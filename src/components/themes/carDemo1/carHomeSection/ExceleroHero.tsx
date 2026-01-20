import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";

type HeroLinkPanel = {
  kind?: "link";
  eyebrow?: string;
  name: string;
  description: string;
  thumbImage: string;
  logoImage: string;
  href: string;
  variant?: "a" | "b";
};

type HeroCompositePanel = {
  kind: "composite";
  eyebrow?: string;
  name: string;
  description: string;
  thumbImage: string;
  logos: Array<{ src: string; alt: string }>;
  actions: Array<{ href: string; label: string }>;
  variant?: "a" | "b";
};

export type HeroPanel = HeroLinkPanel | HeroCompositePanel;

export interface ExceleroHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundVideo?: string;
  backgroundPoster?: string;
  overlayVariant?: "dark" | "darker";
  panels: HeroPanel[];
  single?: boolean;
  separator?: boolean;
}

const ExceleroHero = ({
  title,
  subtitle,
  description,
  backgroundVideo,
  backgroundPoster = "/assets/images/hero/main2.png",
  overlayVariant = "dark",
  panels,
  single,
  separator,
}: ExceleroHeroProps) => {
  return (
    <section
      className={`exelero-hero-section ${overlayVariant === "darker" ? "overlay-darker" : "overlay-dark"} ${separator ? "has-separator" : ""}`}
    >
      <div className="hero-background" aria-hidden="true">
        {backgroundVideo ? (
          <video className="hero-bg-video" autoPlay muted loop playsInline preload="auto" poster={backgroundPoster}>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <Image src={backgroundPoster} alt="" fill className="hero-bg-image" style={{ objectFit: "cover" }} priority />
        )}
        <div className="hero-overlay"></div>
      </div>

      <Container>
        <div className="hero-content" data-aos="fade-up" data-aos-duration={700}>
          <div className="hero-header">
            <h1 className="hero-title">{title}</h1>
            {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
            {description && <p className="hero-description">{description}</p>}
          </div>

          <div className={`geo-panels ${single ? "geo-panels--single" : ""}`}>
            {panels.map((panel, idx) => {
              const variantClass = panel.variant === "a" ? "geo-panel--a" : "geo-panel--b";

              if (panel.kind === "composite") {
                return (
                  <div
                    key={`${panel.name}-${idx}`}
                    className={`geo-panel geo-panel--wide ${variantClass}`}
                    data-aos="fade-up"
                    data-aos-duration={500 + idx * 150}
                  >
                    <div className="geo-thumb" aria-hidden="true">
                      <Image src={panel.thumbImage} alt="" fill className="geo-thumb-img" style={{ objectFit: "cover" }} />
                    </div>

                    <div className="geo-content">
                      <div className="geo-top">
                        <div className="geo-logos">
                          {panel.logos.map((l) => (
                            <div className="geo-logo" key={l.alt}>
                              <Image src={l.src} alt={l.alt} width={150} height={84} className="geo-logo-img" style={{ objectFit: "contain" }} />
                            </div>
                          ))}
                        </div>
                        {panel.eyebrow && <span className="geo-eyebrow">{panel.eyebrow}</span>}
                      </div>

                      <h3 className="geo-title">{panel.name}</h3>
                      <p className="geo-text">{panel.description}</p>

                      <div className="geo-actions">
                        {panel.actions.map((a) => (
                          <Link key={a.href} href={a.href} className="geo-action">
                            {a.label} <i className="ri-arrow-right-line" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={`${panel.name}-${idx}`}
                  href={panel.href}
                  className={`geo-panel ${variantClass}`}
                  data-aos="fade-up"
                  data-aos-duration={500 + idx * 150}
                >
                  <div className="geo-thumb" aria-hidden="true">
                    <Image src={panel.thumbImage} alt="" fill className="geo-thumb-img" style={{ objectFit: "cover" }} />
                  </div>

                  <div className="geo-content">
                    <div className="geo-top">
                      <div className="geo-logo">
                        <Image src={panel.logoImage} alt={`${panel.name} logo`} width={160} height={90} className="geo-logo-img" style={{ objectFit: "contain" }} />
                      </div>
                      {panel.eyebrow && <span className="geo-eyebrow">{panel.eyebrow}</span>}
                    </div>

                    <h3 className="geo-title">{panel.name}</h3>
                    <p className="geo-text">{panel.description}</p>

                    <span className="geo-cta">
                      Explore <i className="ri-arrow-right-line" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExceleroHero;

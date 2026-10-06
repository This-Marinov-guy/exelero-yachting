import TopFilter from "@/components/commonComponents/TopFilter";
import { getPublishedPartners } from "@/lib/partners";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const NewYachtsPage = async () => {
  const yachtPartners = (await getPublishedPartners()).filter((partner) => partner.show_on_new_yachts);

  return (
    <main className="new-yachts-page">
      <TopFilter
        title="New Yachts"
        description="Explore our partners and find your next yacht."
      />
      <section className="new-yachts-directory container" aria-label="New yacht partners">
        {yachtPartners.length > 0 ? (
          <div
            className="new-yachts-cards"
            style={{
              "--new-yachts-columns": Math.min(yachtPartners.length, 4),
              "--new-yachts-columns-tablet": Math.min(yachtPartners.length, 2),
            } as CSSProperties}
          >
            {yachtPartners.map((partner, index) => {
              const image = partner.hero_image_url || partner.breadcrumb_image_url;
              const description = partner.content.split(/\n\s*\n/)[0]?.trim() || `Discover ${partner.name} with Exelero Yachting.`;
              const isL30 = /\bL30\b/i.test(partner.name);

              return (
                <Link
                  key={partner.id}
                  href={`/partners/${partner.slug}`}
                  className="new-yachts-card"
                  aria-label={`Explore ${partner.name}`}
                >
                  <div className="new-yachts-card__media">
                    <Image
                      src={image}
                      alt=""
                      fill
                      priority={index < 3}
                      sizes="(max-width: 600px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      className="new-yachts-card__image"
                      unoptimized={image.startsWith("http")}
                    />
                    {isL30 && <span className="new-yachts-card__type">Class &amp; racing partner</span>}
                  </div>
                  <div className="new-yachts-card__body">
                    <div className="new-yachts-card__logo-wrap">
                      <Image
                        src={partner.logo_url}
                        alt=""
                        width={190}
                        height={68}
                        className="new-yachts-card__logo"
                        unoptimized={partner.logo_url.startsWith("http")}
                      />
                    </div>
                    <h2>{partner.name}</h2>
                    <p>{description}</p>
                    <span className="new-yachts-card__action">
                      Explore {partner.name} <ArrowUpRight aria-hidden="true" size={19} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="new-yachts-empty">
            <h2>Find your next yacht</h2>
            <p>Our partner selection is being updated. Speak with our team about available yachts.</p>
            <Link href="/contact" className="btn-solid">Contact our team</Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default NewYachtsPage;

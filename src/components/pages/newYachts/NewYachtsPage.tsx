import TopFilter from "@/components/commonComponents/TopFilter";
import { getPublishedPartners } from "@/lib/partners";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NewYachtsPage = async () => {
  const yachtBrands = (await getPublishedPartners()).filter((partner) => partner.show_on_new_yachts);
  return (
    <>
      <TopFilter
        title="New Yachts"
        description="Select a brand to discover its yachts and speak with our team."
      />
      <main className="new-yachts-page">
        <section className="new-yachts-panels" aria-label="New yacht brands">
          {yachtBrands.length === 0 && <div className="new-yachts-empty"><h2>Find your next yacht</h2><p>Speak with our team about the latest yachts and available brands.</p><Link href="/contact" className="btn-solid">Contact our team</Link></div>}
          {yachtBrands.map((brand, index) => (
            <Link
              key={brand.id}
              href={`/partners/${brand.slug}`}
              className="new-yachts-panel"
              aria-label={`Explore ${brand.name}`}
            >
              <Image
                src={brand.hero_image_url || brand.breadcrumb_image_url}
                alt={`${brand.name} yacht`}
                fill
                priority={index === 0}
                sizes="(max-width: 991px) 100vw, 50vw"
                quality={82}
                className="new-yachts-panel__image"
                unoptimized={(brand.hero_image_url || brand.breadcrumb_image_url).startsWith("http")}
              />
              <div className="new-yachts-panel__overlay" />

              <div className="new-yachts-panel__content">
                <div className="new-yachts-panel__logo-wrap">
                  <Image
                    src={brand.logo_url}
                    alt={`${brand.name} logo`}
                    width={220}
                    height={90}
                    className="new-yachts-panel__logo"
                    unoptimized={brand.logo_url.startsWith("http")}
                  />
                </div>
                <div className="new-yachts-panel__text">
                  <p>Discover the brand</p>
                  <h2>{brand.name}</h2>
                  <span>
                    Details &amp; inquiry <ArrowUpRight aria-hidden size={22} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default NewYachtsPage;

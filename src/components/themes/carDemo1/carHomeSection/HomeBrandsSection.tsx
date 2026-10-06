import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { getPublishedPartners } from "@/lib/partners";

export default async function HomeBrandsSection() {
  const brands = (await getPublishedPartners()).filter((partner) => partner.show_on_home);
  if (!brands.length) return null;

  return (
    <section className="exelero-brands-section">
      <div className="brands-header" data-aos="fade-up" data-aos-duration={500}>
        <Container><h2 className="brands-title">World-Class Brands</h2></Container>
      </div>
      <div className="brands-grid">
        {brands.map((brand, idx) => (
          <Link key={brand.id} href={`/partners/${brand.slug}`} className="brand-block" data-aos="fade-up" data-aos-duration={500 + idx * 100}>
            <div className="brand-block-img">
              <Image src={brand.hero_image_url || brand.breadcrumb_image_url} alt="" fill sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw" quality={72} className="brand-block-photo" style={{ objectFit: "cover" }} unoptimized={brand.hero_image_url?.startsWith("http") || brand.breadcrumb_image_url.startsWith("http")} />
              <div className="brand-block-overlay" />
            </div>
            <div className="brand-block-content">
              <div className="brand-block-logo-wrap brand-block-logo-wrap--wide">
                <Image src={brand.logo_url} alt="" width={108} height={60} sizes="108px" className="brand-block-logo" style={{ objectFit: "contain" }} unoptimized={brand.logo_url.startsWith("http")} />
              </div>
              <h3 className="brand-block-name">{brand.name}</h3>
              <span className="brand-block-cta">Explore <ArrowRight size={16} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

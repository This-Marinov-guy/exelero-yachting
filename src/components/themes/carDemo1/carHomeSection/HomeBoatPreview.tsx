import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";
import { ArrowRight, MapPin, Ruler, Zap } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { RouteList } from "@/utils/RouteList";

type FeaturedBoat = {
  id: number;
  title: string;
  mainImage: string;
  location: string;
  price: number;
  buildYear: string;
  hullLength: number;
  enginePower: number;
  condition: string;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const conditionLabel = (condition: string) => {
  if (condition === "new") return "New";
  if (condition === "pre-owned") return "Pre-owned";
  return "For Sale";
};

async function fetchFeaturedBoats(): Promise<FeaturedBoat[]> {
  try {
    const supabase = getSupabaseServerClient();

    const { data: boatsData } = await supabase
      .from("boats")
      .select("id, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!boatsData || boatsData.length === 0) return [];

    const boats = await Promise.all(
      boatsData.map(async (boat) => {
        const [{ data: boatData }, { data: imagesData }] = await Promise.all([
          supabase.from("boat_data").select("*").eq("boat_id", boat.id).single(),
          supabase.from("boat_images").select("link, is_cover").eq("boat_id", boat.id).order("display_order", { ascending: true }),
        ]);

        const mainImage = ((imagesData || []) as { link: string; is_cover: boolean }[])
          .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0))
          .map((img) => img.link)[0] || "/assets/images/hero/boats.jpg";

        const numericId = parseInt(boat.id.replace(/-/g, "").substring(0, 8), 16) % 10000000;

        return {
          id: numericId || Math.floor(Math.random() * 1000000),
          mainImage,
          title: boatData?.title || "Untitled Boat",
          price: boatData?.price || 0,
          location: boatData?.location || "",
          buildYear: boatData?.build_year || "",
          hullLength: boatData?.hull_length || 0,
          enginePower: boatData?.engine_power || 0,
          condition: boatData?.condition || "pre-owned",
        };
      })
    );

    return boats;
  } catch {
    return [];
  }
}

const HomeBoatPreview = async () => {
  const boats = await fetchFeaturedBoats();

  if (boats.length === 0) return null;

  return (
    <section className="exelero-boat-preview section-t-space section-b-space">
      <Container>
        <div className="boat-preview-header" data-aos="fade-up" data-aos-duration={500}>
          <div>
            <h2 className="boat-preview-title">Featured Yachts</h2>
          </div>
          <Link href={RouteList.Pages.Boats} className="boat-preview-all">
            View All Listings <ArrowRight size={16} />
          </Link>
        </div>

        <Row className="g-3 g-lg-4">
          {boats.map((boat, idx) => (
            <Col className="col-lg-4 col-sm-6" key={boat.id} data-aos="fade-up" data-aos-duration={500 + idx * 80}>
              <article className="car2-featured-box property2-featured-box">
                <Link href={`/services/brokerage/${boat.id}`} className="car2-featured-img">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                    <Image
                      src={boat.mainImage}
                      alt={boat.title}
                      fill
                      sizes="(max-width: 575px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      quality={70}
                      className="bg-img"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="car2-label-flex">
                    <span className="bg-white">{conditionLabel(boat.condition)}</span>
                    {boat.buildYear && <span className="text-white">{boat.buildYear}</span>}
                  </div>
                </Link>
                <div className="car2-featured-content">
                  <Link href={`/services/brokerage/${boat.id}`}>
                    <h4>{boat.title}</h4>
                  </Link>
                  {boat.location && (
                    <div className="location-flex">
                      <MapPin className="boat-feature-icon" aria-hidden />
                      <h6>{boat.location}</h6>
                    </div>
                  )}
                  <ul className="featured-list" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                    <li>
                      <Ruler className="boat-feature-icon" aria-hidden />
                      <span>{boat.hullLength > 0 ? `${boat.hullLength} m` : "Length on request"}</span>
                    </li>
                    <li>
                      <Zap className="boat-feature-icon" aria-hidden />
                      <span>{boat.enginePower > 0 ? `${boat.enginePower} kW` : "Power on request"}</span>
                    </li>
                  </ul>
                  <div className="price-flex">
                    <h4>
                      {formatPrice(boat.price)} <span style={{ fontFamily: "Satisfy" }}>€</span>
                    </h4>
                    <Link href={`/services/brokerage/${boat.id}`} className="btn-solid">
                      View
                    </Link>
                  </div>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HomeBoatPreview;

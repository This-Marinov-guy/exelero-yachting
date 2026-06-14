import React from "react";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { RouteList } from "@/utils/RouteList";
import { ProductType } from "@/types/Product";
import Boat2DetailBox from "@/components/commonComponents/productBox/Boat2DetailBox";

async function fetchFeaturedBoats(): Promise<ProductType[]> {
  try {
    const supabase = getSupabaseServerClient();

    const { data: boatsData } = await supabase
      .from("boats")
      .select("id, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!boatsData || boatsData.length === 0) return [];

    const boats = await Promise.all(
      boatsData.map(async (boat) => {
        const [{ data: boatData }, { data: brokerData }, { data: imagesData }] = await Promise.all([
          supabase.from("boat_data").select("*").eq("boat_id", boat.id).single(),
          supabase.from("broker_data").select("name, dealer").eq("boat_id", boat.id).single(),
          supabase.from("boat_images").select("link, is_cover").eq("boat_id", boat.id).order("display_order", { ascending: true }),
        ]);

        const images = ((imagesData || []) as { link: string; is_cover: boolean }[])
          .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0))
          .map((img) => img.link);

        const numericId = parseInt(boat.id.replace(/-/g, "").substring(0, 8), 16) % 10000000;

        return {
          id: numericId || Math.floor(Math.random() * 1000000),
          image: images.length > 0 ? images : ["/assets/images/hero/boats.jpg"],
          title: boatData?.title || "Untitled Boat",
          type: "boat",
          category: boatData?.manufacturer ? [boatData.manufacturer] : [],
          features: [
            { icon: "length", text: `${boatData?.hull_length || 0}m Length` },
            { icon: "beam", text: `${boatData?.beam || 0}m Beam` },
            { icon: "power", text: `${boatData?.engine_power || 0}hp` },
          ],
          price: boatData?.price || 0,
          description: boatData?.description || "",
          location: boatData?.location || "",
          year: parseInt(boatData?.build_year || "0"),
          squareFeet: Math.round((boatData?.hull_length || 0) * 10.764),
          bhk: boatData?.build_year || "",
          amenities: boatData?.manufacturer || "",
          productState: "active",
          wishlist: false,
          seats: "",
          color: "",
          kilometers: 0,
          transmission: "",
          owner: "",
          jobTags: [],
          company: brokerData?.dealer || brokerData?.name || "",
          boatId: boat.id,
          manufacturer: boatData?.manufacturer || "",
          buildNumber: boatData?.build_number || "",
          buildYear: boatData?.build_year || "",
          beam: boatData?.beam || 0,
          hullLength: boatData?.hull_length || 0,
          draft: boatData?.draft || 0,
          waterlineLength: boatData?.waterline_length || 0,
          ballast: boatData?.ballast || 0,
          displacement: boatData?.displacement || 0,
          enginePower: boatData?.engine_power || 0,
          fuelTank: boatData?.fuel_tank || 0,
          waterTank: boatData?.water_tank || 0,
          vatIncluded: boatData?.vat_included ?? false,
          dealer: brokerData?.dealer || "",
          boatType: boatData?.type || "",
          condition: boatData?.condition || "pre-owned",
        } as ProductType;
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
              <Boat2DetailBox data={boat} label="For Sale" index={idx} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HomeBoatPreview;

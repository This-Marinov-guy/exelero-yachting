import { getSupabaseServerClient } from "@/lib/supabaseServer";
import BoatsPageClient from "./BoatsPageClient";
import { ProductType } from "@/types/Product";

async function fetchActiveBoats(): Promise<ProductType[]> {
  const supabase = getSupabaseServerClient();

  try {
    // Fetch active boats with related data
    const { data: boatsData, error: boatsError } = await supabase
      .from("boats")
      .select("id, user_id, slug, dealer_id, created_at")
      .eq("active", true)
      .eq("bought", false)
      .order("created_at", { ascending: false });

    if (boatsError) {
      console.error("Error fetching boats:", boatsError);
      return [];
    }

    if (!boatsData || boatsData.length === 0) {
      return [];
    }

    // Fetch boat_data, broker_data, and images for each boat
    const boatsWithDetails = await Promise.all(
      boatsData.map(async (boat) => {
        // Fetch boat_data
        const { data: boatData } = await supabase
          .from("boat_data")
          .select("*")
          .eq("boat_id", boat.id)
          .single();

        // Fetch broker_data
        let brokerData = null;
        if (boat.dealer_id) {
          const { data } = await supabase
            .from("broker_data")
            .select("name, dealer")
            .eq("id", boat.dealer_id)
            .maybeSingle();
          brokerData = data;
        }
        if (!brokerData) {
          const { data } = await supabase
            .from("broker_data")
            .select("name, dealer")
            .eq("boat_id", boat.id)
            .maybeSingle();
          brokerData = data;
        }
        if (!brokerData) {
          const { data } = await supabase
            .from("broker_data")
            .select("name, dealer")
            .eq("user_id", boat.user_id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();
          brokerData = data;
        }

        // Fetch media — cover item first, then by display_order
        const { data: imagesData } = await supabase
          .from("boat_images")
          .select("link, is_cover, media_type")
          .eq("boat_id", boat.id)
          .order("display_order", { ascending: true });

        const media = (imagesData || [])
          .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0))
          .map((item, index) => ({
            url: item.link,
            type: item.media_type === "video" ? "video" as const : "image" as const,
            isCover: Boolean(item.is_cover),
            order: index,
          }));
        const images = media.filter((item) => item.type === "image").map((item) => item.url);
        const mainImage = images[0] || "/assets/images/hero/boats.jpg";

        // Generate a numeric ID from UUID
        const numericId = parseInt(boat.id.replace(/-/g, "").substring(0, 8), 16) % 10000000;

        return {
          id: numericId || Math.floor(Math.random() * 1000000),
          image: images.length > 0 ? images : [mainImage],
          media,
          title: boatData?.title || "Untitled Boat",
          type: "boat",
          category: boatData?.manufacturer ? [boatData.manufacturer] : [],
          features: [
            { icon: "length", text: `${boatData?.hull_length || 0}m Length` },
            { icon: "beam", text: `${boatData?.beam || 0}m Beam` },
            { icon: "power", text: `${boatData?.engine_power || 0}hp` },
          ],
          price: boatData?.price ?? undefined,
          description: boatData?.description || "",
          location: boatData?.location || "",
          year: parseInt(boatData?.build_year || "0"),
          squareFeet: Math.round((boatData?.hull_length || 0) * 10.764), // Convert meters to square feet for filtering
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
          // Boat-specific properties
          boatId: boat.id,
          slug: boat.slug || "",
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
          keelType: boatData?.keel_type || "",
          ceDesignCategory: boatData?.ce_design_category || "",
          material: boatData?.material || "",
          brochures: Array.isArray(boatData?.brochures) ? boatData.brochures : [],
        } as ProductType;
      })
    );

    return boatsWithDetails;
  } catch (error) {
    console.error("Error fetching boats:", error);
    return [];
  }
}

const BoatsPage = async () => {
  const boats = await fetchActiveBoats();

  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Yachts & Boats for Sale",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale",
    url: "/boats",
    numberOfItems: boats.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoatsPageClient boats={boats} />
    </>
  );
};

export default BoatsPage;

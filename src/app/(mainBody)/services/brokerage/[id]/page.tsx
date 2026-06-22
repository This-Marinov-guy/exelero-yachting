import { getSupabaseServerClient } from "@/lib/supabaseServer";
import BoatDetailContainer from "@/components/pages/boats/BoatDetailContainer";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductType } from "@/types/Product";

// Helper function to generate numeric ID from UUID (same as in BoatsPage)
const generateNumericId = (uuid: string): number => {
  return parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;
};

const slugifyBoatTitle = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildLegacyBoatSlug = (title: string, buildYear: string) => {
  const normalizedTitle = title.trim();
  const normalizedBuildYear = buildYear.trim();
  const slugSource = normalizedBuildYear && !normalizedTitle.includes(normalizedBuildYear)
    ? `${normalizedTitle} ${normalizedBuildYear}`
    : normalizedTitle;

  return slugifyBoatTitle(slugSource);
};

async function fetchBoatByIdentifier(identifier: string): Promise<ProductType | null> {
  const supabase = getSupabaseServerClient();

  try {
    // Fetch all active boats
    const { data: boatsData, error: boatsError } = await supabase
      .from("boats")
      .select("id, user_id, slug, dealer_id, created_at")
      .eq("active", true)
      .eq("bought", false)
      .order("created_at", { ascending: false });

    if (boatsError) {
      console.error("Error fetching boats:", boatsError);
      return null;
    }

    if (!boatsData || boatsData.length === 0) {
      return null;
    }

    const numericId = Number.parseInt(identifier, 10);
    const isNumericIdentifier = /^\d+$/.test(identifier);
    let boat = boatsData.find((b) =>
      b.slug === identifier || (isNumericIdentifier && generateNumericId(b.id) === numericId)
    );

    if (!boat && !isNumericIdentifier) {
      const { data: legacyBoatData } = await supabase
        .from("boat_data")
        .select("boat_id, title, build_year")
        .in("boat_id", boatsData.map((b) => b.id));

      const legacyMatch = (legacyBoatData || []).find((row) =>
        buildLegacyBoatSlug(row.title || "", row.build_year || "") === identifier
      );

      if (legacyMatch) {
        boat = boatsData.find((b) => b.id === legacyMatch.boat_id);
      }
    }

    if (!boat) {
      return null;
    }

    // Fetch boat_data
    const { data: boatData } = await supabase
      .from("boat_data")
      .select("*")
      .eq("boat_id", boat.id)
      .single();

    if (!boatData) {
      return null;
    }

    // Fetch broker_data
    let brokerData = null;
    if (boat.dealer_id) {
      const { data } = await supabase
        .from("broker_data")
        .select("name, dealer, email, phone, user_id")
        .eq("id", boat.dealer_id)
        .maybeSingle();
      brokerData = data;
    }
    if (!brokerData) {
      const { data } = await supabase
        .from("broker_data")
        .select("name, dealer, email, phone, user_id")
        .eq("boat_id", boat.id)
        .maybeSingle();
      brokerData = data;
    }
    if (!brokerData) {
      const { data } = await supabase
        .from("broker_data")
        .select("name, dealer, email, phone, user_id")
        .eq("user_id", boat.user_id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      brokerData = data;
    }

    // Fetch broker profile image if user_id exists
    let brokerProfileImage = null;
    if (brokerData?.user_id) {
      const { data: profileImageData } = await supabase
        .from("profile_image")
        .select("image_url")
        .eq("user_id", brokerData.user_id)
        .single();
      
      brokerProfileImage = profileImageData?.image_url || null;
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
    const publicId = generateNumericId(boat.id);

    return {
      id: publicId,
      image: images.length > 0 ? images : [mainImage],
      media,
      title: boatData.title || "Untitled Boat",
      type: "boat",
      category: boatData.manufacturer ? [boatData.manufacturer] : [],
      features: [
        { icon: "length", text: `${boatData.hull_length || 0}m Length` },
        { icon: "beam", text: `${boatData.beam || 0}m Beam` },
        { icon: "power", text: `${boatData.engine_power || 0}kW` },
      ],
      price: boatData.price ?? undefined,
      description: boatData.description || "",
      location: boatData.location || "",
      year: parseInt(boatData.build_year || "0"),
      squareFeet: Math.round((boatData.hull_length || 0) * 10.764),
      bhk: boatData.build_year || "",
      amenities: boatData.manufacturer || "",
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
      manufacturer: boatData.manufacturer || "",
      buildNumber: boatData.build_number || "",
      buildYear: boatData.build_year || "",
      hullLength: boatData.hull_length || 0,
      beam: boatData.beam || 0,
      draft: boatData.draft || 0,
      waterlineLength: boatData.waterline_length || 0,
      ballast: boatData.ballast || 0,
      displacement: boatData.displacement || 0,
      enginePower: boatData.engine_power || 0,
      fuelTank: boatData.fuel_tank || 0,
      waterTank: boatData.water_tank || 0,
      vatIncluded: boatData.vat_included ?? false,
      dealer: brokerData?.dealer || "",
      boatType: boatData.type || "",
      condition: boatData.condition || "pre-owned",
      keelType: boatData.keel_type || "",
      ceDesignCategory: boatData.ce_design_category || "",
      material: boatData.material || "",
      additionalDetails: boatData.additional_details || "",
      brochure: boatData.brochure || "",
      brochures: Array.isArray(boatData.brochures) && boatData.brochures.length > 0
        ? boatData.brochures
        : boatData.brochure
          ? [{ url: boatData.brochure, name: "Brochure", order: 0 }]
          : [],
      brokerName: brokerData?.name || "",
      brokerEmail: brokerData?.email || "",
      brokerPhone: brokerData?.phone || "",
      brokerProfileImage: brokerProfileImage || "",
    } as ProductType;
  } catch (error) {
    console.error("Error fetching boat:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

const stripHtml = (value?: string) => {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const truncateMetaDescription = (value: string, maxLength = 180) => {
  if (value.length <= maxLength) return value;
  const truncated = value.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated}...`;
};

const buildBoatMetaDescription = (boat: ProductType) => {
  const plainDescription = stripHtml(boat.description);
  if (plainDescription) return truncateMetaDescription(plainDescription);

  return truncateMetaDescription(
    `Explore ${boat.title} - ${boat.manufacturer} yacht for sale. ${boat.location ? `Located in ${boat.location}.` : ""}`
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boat = await fetchBoatByIdentifier(id);

  if (!boat) {
    return {
      title: "Boat Not Found | Exelero Yachting",
    };
  }

  if (boat.slug && id !== boat.slug && !/^\d+$/.test(id)) {
    redirect(`/services/brokerage/${boat.slug}`);
  }

  const metaDescription = buildBoatMetaDescription(boat);
  const canonicalPath = `/services/brokerage/${boat.slug || id}`;

  return {
    title: `${boat.title} | Exelero Yachting`,
    description: metaDescription,
    openGraph: {
      title: `${boat.title} | Exelero Yachting`,
      description: metaDescription,
      url: canonicalPath,
      siteName: "Exelero Yachting",
      type: "website",
      images: boat.image && boat.image.length > 0 ? [
        {
          url: boat.image[0],
          width: 1200,
          height: 630,
          alt: boat.title,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${boat.title} | Exelero Yachting`,
      description: metaDescription,
      images: boat.image && boat.image.length > 0 ? [boat.image[0]] : [],
    },
    alternates: {
      canonical: canonicalPath,
    },
  };
}

const BoatDetail = async ({ params }: Props) => {
  const { id } = await params;
  const boat = await fetchBoatByIdentifier(id);

  if (!boat) {
    notFound();
  }

  if (boat.slug && id !== boat.slug && !/^\d+$/.test(id)) {
    redirect(`/services/brokerage/${boat.slug}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exelero.com";
  const boatUrl = `${siteUrl}/services/brokerage/${boat.slug || id}`;
  const plainDescription = buildBoatMetaDescription(boat);

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": boat.title,
    "description": plainDescription,
    "image": boat.image,
    "manufacturer": boat.manufacturer,
    "modelDate": boat.buildYear,
    "vehicleConfiguration": boat.boatType,
    ...(boat.price != null ? {
      "offers": {
        "@type": "Offer",
        "price": boat.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": boatUrl
      }
    } : {})
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Brokerage",
        "item": `${siteUrl}/services/brokerage`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": boat.title,
        "item": boatUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BoatDetailContainer boat={boat} />
    </>
  );
};

export default BoatDetail;

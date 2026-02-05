import PartnerPage from "@/components/pages/partners/PartnerPage";
import { Partners } from "@/data/partners";
import type { Metadata } from "next";

type Props = { params: Promise<{ partnerId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partnerId } = await params;
  const partner = partnerId ? Partners[partnerId] : undefined;

  if (!partner) {
    return { title: "Partner Not Found" };
  }

  return {
    title: partner.name,
    description: partner.description,
    openGraph: {
      title: `${partner.name} | Exelero Yachting`,
      description: partner.description,
      url: `/partners/${partnerId}`,
      type: "website",
    },
    alternates: { canonical: `/partners/${partnerId}` },
    robots: { index: true, follow: true },
  };
}

const PartnerDetailPage = () => {
  return <PartnerPage />;
};

export default PartnerDetailPage;

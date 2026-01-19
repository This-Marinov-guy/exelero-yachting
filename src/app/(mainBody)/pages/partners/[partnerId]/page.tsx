import PartnerPage from "@/components/pages/partners/PartnerPage";

interface PartnerPageParams {
  params: {
    partnerId: string;
  };
}

export default function PartnerDetailPage({ params }: PartnerPageParams) {
  return <PartnerPage partnerId={params.partnerId} />;
}

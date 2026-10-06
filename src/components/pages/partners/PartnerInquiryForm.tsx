import InquiryForm from "@/components/commonComponents/InquiryForm";
import type { Partner } from "@/types/Partner";

export default function PartnerInquiryForm({ partner }: { partner: Partner }) {
  return <InquiryForm endpoint={`/api/partners/${partner.slug}/inquiries`} subject={partner.name} fields={partner.form_type === "custom" ? partner.custom_fields : []} />;
}

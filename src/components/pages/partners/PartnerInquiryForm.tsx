import InquiryForm from "@/components/commonComponents/InquiryForm";
import type { Partner, PartnerFormField } from "@/types/Partner";

export default function PartnerInquiryForm({ partner, englishFields }: { partner: Partner; englishFields: PartnerFormField[] }) {
  return <InquiryForm endpoint={`/api/partners/${partner.slug}/inquiries`} subject={partner.name} fields={partner.form_type === "custom" ? englishFields : []} displayFields={partner.form_type === "custom" ? partner.custom_fields : []} />;
}

export type PartnerStatus = "draft" | "published";
export type PartnerFormType = "standard" | "custom";
export type PartnerFieldType = "text" | "tel" | "textarea" | "select";

export type PartnerFormField = {
  id: string;
  label: string;
  type: PartnerFieldType;
  required: boolean;
  options?: string[];
};

export type Partner = {
  id: string;
  slug: string;
  name: string;
  logo_url: string;
  breadcrumb_image_url: string;
  hero_image_url: string | null;
  content: string;
  website_url: string | null;
  primary_color: string;
  secondary_color: string;
  form_type: PartnerFormType;
  custom_fields: PartnerFormField[];
  status: PartnerStatus;
  show_on_home: boolean;
  show_on_new_yachts: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PartnerInput = Pick<
  Partner,
  | "slug"
  | "name"
  | "logo_url"
  | "breadcrumb_image_url"
  | "hero_image_url"
  | "content"
  | "website_url"
  | "primary_color"
  | "secondary_color"
  | "form_type"
  | "custom_fields"
  | "status"
  | "show_on_home"
  | "show_on_new_yachts"
  | "sort_order"
>;

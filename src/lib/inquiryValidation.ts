import type { PartnerFormField } from "@/types/Partner";

export type InquiryDetails = {
  name: string;
  email: string;
  phone: string;
  message: string;
  answers: Record<string, string>;
};

export const INQUIRY_RESERVED_FIELDS = ["name", "email", "phone", "message", "request_id", "website_check", "__proto__", "constructor", "prototype"];

export function inquiryExtraFields(fields: PartnerFormField[]): PartnerFormField[] {
  return fields.filter(field => !INQUIRY_RESERVED_FIELDS.includes(field.id));
}

export function validateInquiry(body: Record<string, unknown>, fields: PartnerFormField[] = []):
  { data: InquiryDetails; error?: never; field?: never } | { error: string; field: string; data?: never } {
  const text = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const name = text("name"), email = text("email"), phone = text("phone"), message = text("message");
  if (!name || name.length > 120 || /[\r\n]/.test(name)) return { error: "Enter your name, using up to 120 characters.", field: "name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "Enter an email address such as name@example.com.", field: "email" };
  if (phone.length > 50 || (phone && !/^[+\d\s().\-x#]+$/i.test(phone))) return { error: "Enter a phone number with its country code, or leave it blank.", field: "phone" };
  if (message.length > 3000) return { error: "Keep your message within 3,000 characters.", field: "message" };
  const answers: Record<string, string> = {};
  for (const field of inquiryExtraFields(fields)) {
    const answer = text(field.id);
    if (field.required && !answer) return { error: `Enter ${field.label.toLowerCase()}.`, field: field.id };
    if (answer.length > (field.type === "textarea" ? 3000 : 300)) return { error: `${field.label} is too long. Please shorten it.`, field: field.id };
    if (field.type === "select" && answer && !field.options?.includes(answer)) return { error: `Choose an option for ${field.label.toLowerCase()}.`, field: field.id };
    if (answer) answers[field.id] = answer;
  }
  return { data: { name, email, phone, message, answers } };
}

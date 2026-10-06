export const INQUIRY_STATUSES = ["pending", "completed", "rejected"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return INQUIRY_STATUSES.includes(value as InquiryStatus);
}

export function inquiryStatusLabel(status: InquiryStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

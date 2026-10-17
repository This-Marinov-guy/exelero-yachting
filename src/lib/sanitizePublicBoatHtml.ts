import "server-only";
import sanitizeHtml from "sanitize-html";

export function sanitizePublicBoatHtml(value: string | null | undefined): string {
  if (!value) return "";
  const decoded = value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
  return sanitizeHtml(decoded, {
    allowedTags: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span", "div"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

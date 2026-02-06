import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "div",
];
const ALLOWED_ATTR = ["href", "target", "rel", "style", "class", "color"];

/**
 * Decode common HTML entities so content stored escaped (e.g. &lt;p&gt;) is turned back into HTML.
 */
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

/**
 * Sanitize HTML for safe display: decodes entities if present, then sanitizes with DOMPurify.
 * Use with dangerouslySetInnerHTML so rich text (e.g. from TipTap) renders as HTML, not literal tags.
 */
export function sanitizeHtmlForDisplay(html: string): string {
  if (!html || typeof html !== "string") return "";
  const decoded = decodeHtmlEntities(html);
  return DOMPurify.sanitize(decoded, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Sanitize HTML before saving to DB (e.g. from rich text editor).
 */
export function sanitizeHtmlForSave(html: string): string {
  if (!html || typeof html !== "string") return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  });
}

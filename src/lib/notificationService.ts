import nodemailer from "nodemailer";

const NOTIFICATION_TO = process.env.NOTIFICATION_TO_EMAIL || "exelerodev@gmail.com";

function getTransporter() {
  const host = process.env.GMAIL_HOST;
  const port = process.env.GMAIL_PORT;
  const user = process.env.GMAIL_USERNAME;
  const pass = process.env.GMAIL_PASSWORD;
  const secure = process.env.GMAIL_ENCRYPTION?.toLowerCase() === "ssl";

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing Gmail config: GMAIL_HOST, GMAIL_PORT, GMAIL_USERNAME, GMAIL_PASSWORD must be set."
    );
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: port === "465" || secure,
    auth: { user, pass },
    ...(process.env.GMAIL_ENCRYPTION?.toLowerCase() === "tls" && { requireTLS: true }),
  });
}

function getFrom() {
  const fromAddress = process.env.GMAIL_FROM_ADDRESS || process.env.GMAIL_USERNAME;
  const fromName = process.env.GMAIL_FROM_NAME || "Notification Center";
  return fromName ? `"${fromName}" <${fromAddress}>` : fromAddress;
}

export type CharterPayload = {
  name: string;
  email: string;
  phone?: string | null;
  charter_type: string;
  date_from: string;
  date_to: string;
  group_size: number;
  note?: string | null;
};

export type TransportationPayload = {
  name: string;
  email: string;
  phone?: string | null;
  date_start: string;
  deadline_date: string;
  start_point: string;
  end_point: string;
  boat_weight_kg?: number | null;
  boat_length_m?: number | null;
  boat_beam_m?: number | null;
  boat_draft_m?: number | null;
  boat_height_m?: number | null;
  note?: string | null;
};

function formatCharterHtml(data: CharterPayload): string {
  return `
    <h2>New Charter Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    <p><strong>Charter type:</strong> ${escapeHtml(data.charter_type)}</p>
    <p><strong>Date from:</strong> ${escapeHtml(data.date_from)}</p>
    <p><strong>Date to:</strong> ${escapeHtml(data.date_to)}</p>
    <p><strong>Group size:</strong> ${data.group_size}</p>
    ${data.note ? `<p><strong>Note:</strong><br/>${escapeHtml(data.note).replace(/\n/g, "<br/>")}</p>` : ""}
  `.trim();
}

function formatTransportationHtml(data: TransportationPayload): string {
  const optional = [
    data.boat_weight_kg != null && `Weight: ${data.boat_weight_kg} kg`,
    data.boat_length_m != null && `Length: ${data.boat_length_m} m`,
    data.boat_beam_m != null && `Beam: ${data.boat_beam_m} m`,
    data.boat_draft_m != null && `Draft: ${data.boat_draft_m} m`,
    data.boat_height_m != null && `Height: ${data.boat_height_m} m`,
  ].filter(Boolean);
  return `
    <h2>New Transportation Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    <p><strong>Date start:</strong> ${escapeHtml(data.date_start)}</p>
    <p><strong>Deadline:</strong> ${escapeHtml(data.deadline_date)}</p>
    <p><strong>From:</strong> ${escapeHtml(data.start_point)}</p>
    <p><strong>To:</strong> ${escapeHtml(data.end_point)}</p>
    ${optional.length ? `<p><strong>Boat:</strong> ${optional.join(", ")}</p>` : ""}
    ${data.note ? `<p><strong>Note:</strong><br/>${escapeHtml(data.note).replace(/\n/g, "<br/>")}</p>` : ""}
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendCharterNotification(data: CharterPayload): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: getFrom(),
    to: NOTIFICATION_TO,
    subject: `[Exelero] New Charter Request from ${data.name}`,
    html: formatCharterHtml(data),
    text: `New Charter Request\n\nName: ${data.name}\nEmail: ${data.email}\nCharter type: ${data.charter_type}\nDate from: ${data.date_from}\nDate to: ${data.date_to}\nGroup size: ${data.group_size}${data.note ? `\nNote: ${data.note}` : ""}`,
  });
}

export async function sendTransportationNotification(data: TransportationPayload): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: getFrom(),
    to: NOTIFICATION_TO,
    subject: `[Exelero] New Transportation Request from ${data.name}`,
    html: formatTransportationHtml(data),
    text: `New Transportation Request\n\nName: ${data.name}\nEmail: ${data.email}\nDate start: ${data.date_start}\nDeadline: ${data.deadline_date}\nFrom: ${data.start_point}\nTo: ${data.end_point}${data.note ? `\nNote: ${data.note}` : ""}`,
  });
}

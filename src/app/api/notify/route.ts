import { NextRequest, NextResponse } from "next/server";
import {
  sendCharterNotification,
  sendTransportationNotification,
  CharterPayload,
  TransportationPayload,
} from "@/lib/notificationService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body as { type: string; data: unknown };

    if (!type || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid body: { type, data } required." },
        { status: 400 }
      );
    }

    if (type === "charter") {
      const payload = data as CharterPayload;
      if (
        !payload.name ||
        !payload.email ||
        !payload.charter_type ||
        !payload.date_from ||
        !payload.date_to ||
        typeof payload.group_size !== "number"
      ) {
        return NextResponse.json(
          { error: "Charter payload must include name, email, charter_type, date_from, date_to, group_size." },
          { status: 400 }
        );
      }
      await sendCharterNotification(payload);
      return NextResponse.json({ ok: true, message: "Charter notification sent." });
    }

    if (type === "transportation") {
      const payload = data as TransportationPayload;
      if (
        !payload.name ||
        !payload.email ||
        !payload.date_start ||
        !payload.deadline_date ||
        !payload.start_point ||
        !payload.end_point
      ) {
        return NextResponse.json(
          {
            error:
              "Transportation payload must include name, email, date_start, deadline_date, start_point, end_point.",
          },
          { status: 400 }
        );
      }
      await sendTransportationNotification(payload);
      return NextResponse.json({ ok: true, message: "Transportation notification sent." });
    }

    return NextResponse.json({ error: "Unknown type. Use 'charter' or 'transportation'." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send notification.";
    console.error("[notify]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

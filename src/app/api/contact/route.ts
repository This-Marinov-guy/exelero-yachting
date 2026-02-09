import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sendContactNotification } from "@/lib/notificationService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, number, message } = body;

    const first_name = typeof firstName === "string" ? firstName.trim() : "";
    const last_name = typeof lastName === "string" ? lastName.trim() : "";
    const emailVal = typeof email === "string" ? email.trim() : "";
    const phone = typeof number !== "undefined" ? String(number).trim() : "";
    const messageVal = typeof message === "string" ? message.trim() : "";

    if (!first_name || !last_name || !emailVal || !phone || !messageVal) {
      return NextResponse.json(
        { error: "All fields are required: firstName, lastName, email, number, message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("contact").insert({
      first_name,
      last_name,
      email: emailVal,
      phone,
      message: messageVal,
    });

    if (error) {
      console.error("[contact] DB insert error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to save contact." },
        { status: 500 }
      );
    }

    await sendContactNotification({
      first_name,
      last_name,
      email: emailVal,
      phone,
      message: messageVal,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit contact.";
    console.error("[contact]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Message sent successfully." });
}

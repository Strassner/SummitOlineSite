import { NextResponse } from "next/server";

const TOPICS = ["General Question", "Private Training", "Membership", "Camps/Clinics", "Team Training", "Partnership/Sponsorship"];

/**
 * Contact form endpoint (stub).
 * Validates input and rejects bots (honeypot), then logs the message.
 * TODO at launch: forward to email (Resend / SendGrid / Postmark) and/or your CRM.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // honeypot: real users never fill this hidden field
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const topic = String(body.topic ?? "");
  const message = String(body.message ?? "").trim();

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 5 || !TOPICS.includes(topic)) {
    return NextResponse.json({ ok: false, error: "Please complete all required fields." }, { status: 422 });
  }
  if (name.length > 120 || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 422 });
  }

  console.log("[contact]", { name, email, topic, phone: body.phone, message });
  return NextResponse.json({ ok: true });
}

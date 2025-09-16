// src/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  // Surfacing this early helps in local dev / misconfigured deploys.
  console.warn("RESEND_API_KEY is not set");
}
const resend = new Resend(apiKey!);

export async function POST(req: Request) {
  try {
    const { name, email, message, company } = await req.json();

    // Honeypot + basic validation (mirrors your client)
    if (company) {
      return NextResponse.json({ ok: false, error: "Spam detected." }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ ok: false, error: "Tell us a bit about your project." }, { status: 400 });
    }

    // Use your domain sender once Resend verifies DNS:
    // const from = "Sidewalks <no-reply@sidewalks.co.nz>";
    // While waiting for verification, use onboarding sender:
    const from = "Sidewalks <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: "admin@sidewalks.co.nz",
      replyTo: email, // ✅ correct prop name
      subject: `Contact form — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      // You can also include an HTML version if you want:
      // html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br/><strong>Email:</strong> ${escapeHtml(email)}</p><pre>${escapeHtml(message)}</pre>`
    });

    if (error) {
      // Resend returns a structured error; surface message to client
      return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Email failed." },
      { status: 500 }
    );
  }
}

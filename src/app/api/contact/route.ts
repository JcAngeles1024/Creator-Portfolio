import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { sendContactEmail } from "@/lib/resend";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot field: real users never fill this in. */
  website?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (asTrimmedString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const message = asTrimmedString(body.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const { success, reset } = await checkRateLimit(getClientIp(request));

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const result = await sendContactEmail({ name, email, message });

  if (!result.ok && result.reason !== "not_configured") {
    return NextResponse.json({ error: "Could not send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

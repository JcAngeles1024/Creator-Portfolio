import "server-only";
import { Resend } from "resend";
import { env, isResendConfigured } from "@/lib/env";

let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    client = new Resend(env.RESEND_API_KEY);
  }
  return client;
}

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export type SendResult = { ok: true; id: string | null } | { ok: false; reason: string };

export async function sendContactEmail(payload: ContactMessage): Promise<SendResult> {
  if (!isResendConfigured()) {
    // Local development without secrets: log instead of failing the request.
    console.warn("[resend] not configured — contact message not delivered:", payload);
    return { ok: false, reason: "not_configured" };
  }

  const { data, error } = await getClient().emails.send({
    from: env.CONTACT_FROM_EMAIL as string,
    to: env.CONTACT_TO_EMAIL as string,
    replyTo: payload.email,
    subject: `Portfolio enquiry from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      payload.message,
    ].join("\n"),
  });

  if (error) {
    console.error("[resend] send failed:", error);
    return { ok: false, reason: error.message };
  }

  return { ok: true, id: data?.id ?? null };
}

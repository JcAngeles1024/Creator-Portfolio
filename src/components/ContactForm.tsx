"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-foreground/40";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Captured up front: currentTarget is nulled once the handler yields.
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Network error. Try email instead.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-lg space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm text-foreground/70">
          Name
        </label>
        <input id="name" name="name" required autoComplete="name" className={fieldClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm text-foreground/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm text-foreground/70">
          Project details
        </label>
        <textarea id="message" name="message" rows={5} required className={fieldClass} />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {status === "sent" ? (
        <p className="text-sm text-foreground/70" role="status">
          Thanks &mdash; I will be in touch shortly.
        </p>
      ) : null}
      {status === "error" && error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

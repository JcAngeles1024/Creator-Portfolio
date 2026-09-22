import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env, isUpstashConfigured } from "@/lib/env";

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit {
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({
        url: env.UPSTASH_REDIS_REST_URL as string,
        token: env.UPSTASH_REDIS_REST_TOKEN as string,
      }),
      // Five submissions per IP per hour is generous for a contact form.
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "portfolio:contact",
    });
  }
  return limiter;
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  /** Unix ms timestamp when the window resets. */
  reset: number;
};

/**
 * Rate limits by identifier. When Upstash is not configured (local dev) every
 * request is allowed through so the form stays usable.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!isUpstashConfigured()) {
    return { success: true, remaining: Number.POSITIVE_INFINITY, reset: 0 };
  }

  const { success, remaining, reset } = await getLimiter().limit(identifier);
  return { success, remaining, reset };
}

/** Best-effort client IP from the proxy headers Vercel and most hosts set. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

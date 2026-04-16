import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const applyRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "ratelimit:apply",
});
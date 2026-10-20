// Rate limit por IP com janela deslizante em memória (CLAUDE.md §5).
// Em serverless a memória não sobrevive a cold starts, então isto barra rajadas
// de spam mas não é garantia absoluta; para garantia forte, trocar por Upstash
// Ratelimit mantendo esta mesma interface.

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function createRateLimiter({ limit, windowMs, now = Date.now }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const current = now();
      const windowStart = current - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, remaining: 0 };
      }

      recent.push(current);
      hits.set(key, recent);

      // Poda periódica para a memória não crescer sem limite.
      if (hits.size > 5000) {
        for (const [k, times] of hits) {
          if (times.every((t) => t <= windowStart)) hits.delete(k);
        }
      }

      return { allowed: true, remaining: limit - recent.length };
    },
  };
}

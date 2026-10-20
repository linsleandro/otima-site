import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../src/lib/rate-limit';

describe('rate limiter por IP', () => {
  it('permite até o limite dentro da janela', () => {
    const clock = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000, now: () => clock });

    expect(limiter.check('1.2.3.4').allowed).toBe(true);
    expect(limiter.check('1.2.3.4').allowed).toBe(true);
    expect(limiter.check('1.2.3.4').allowed).toBe(true);
    expect(limiter.check('1.2.3.4').allowed).toBe(false);
  });

  it('libera novamente depois que a janela desliza', () => {
    let clock = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000, now: () => clock });

    limiter.check('ip');
    limiter.check('ip');
    expect(limiter.check('ip').allowed).toBe(false);

    clock = 61_000;
    expect(limiter.check('ip').allowed).toBe(true);
  });

  it('conta IPs de forma independente', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000, now: () => 0 });

    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('b').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
  });
});

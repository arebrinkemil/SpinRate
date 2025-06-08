import { RateLimitConfig } from './validation';
import { RateLimitError } from './errors';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  public getConfig(): RateLimitConfig {
    return this.config;
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  public check(key: string): boolean {
    this.cleanup();
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    if (this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    if (this.store[key].count >= this.config.limit) {
      throw new RateLimitError();
    }

    this.store[key].count++;
    return true;
  }

  public reset(key: string): void {
    delete this.store[key];
  }
}

// Create a singleton instance with default config
export const rateLimiter = new RateLimiter({
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
});

// Middleware factory
export function createRateLimit(config?: Partial<RateLimitConfig>) {
  const limiter = config ? new RateLimiter({ ...rateLimiter.getConfig(), ...config }) : rateLimiter;

  return async function rateLimitMiddleware(request: Request): Promise<void> {
    const key = request.headers.get('x-forwarded-for') || 'unknown';
    limiter.check(key);
  };
} 
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class Cache {
  private static instance: Cache;
  private store: Map<string, CacheEntry<any>>;
  private readonly defaultTTL: number;

  private constructor(defaultTTL: number = 60 * 1000) { // 1 minute default TTL
    this.store = new Map();
    this.defaultTTL = defaultTTL;
  }

  public static getInstance(defaultTTL?: number): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(defaultTTL);
    }
    return Cache.instance;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiry < now) {
        this.store.delete(key);
      }
    }
  }

  public set<T>(key: string, data: T, ttl?: number): void {
    this.cleanup();
    this.store.set(key, {
      data,
      expiry: Date.now() + (ttl || this.defaultTTL),
    });
  }

  public get<T>(key: string): T | null {
    this.cleanup();
    const entry = this.store.get(key);
    if (!entry) return null;
    return entry.data as T;
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public has(key: string): boolean {
    this.cleanup();
    return this.store.has(key);
  }
}

// Create a singleton instance
export const cache = Cache.getInstance();

// Cache decorator for methods
export function cached(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheKey = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const key = `${cacheKey}:${JSON.stringify(args)}`;
      const cached = cache.get(key);
      if (cached) return cached;

      const result = await originalMethod.apply(this, args);
      cache.set(key, result, ttl);
      return result;
    };

    return descriptor;
  };
}

// Cache middleware factory
export function createCacheMiddleware(ttl?: number) {
  return async function cacheMiddleware(request: Request, next: () => Promise<Response>) {
    const key = request.url;
    const cached = cache.get<Response>(key);
    if (cached) return cached;

    const response = await next();
    cache.set(key, response, ttl);
    return response;
  };
} 
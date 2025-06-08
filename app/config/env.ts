import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Spotify API
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  
  // Authentication
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  
  // API
  API_URL: z.string().url(),
  API_VERSION: z.string(),
  
  // Cache
  CACHE_TTL: z.string().transform(Number).pipe(z.number().min(0)),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().min(1)),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  
  // Feature Flags
  ENABLE_CACHE: z.string().transform((val) => val === 'true'),
  ENABLE_RATE_LIMIT: z.string().transform((val) => val === 'true'),
  ENABLE_LOGGING: z.string().transform((val) => val === 'true'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

export const env = validateEnv();

// Configuration object with defaults
export const config = {
  database: {
    url: env.DATABASE_URL,
  },
  spotify: {
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
  },
  auth: {
    secret: env.AUTH_SECRET,
    url: env.AUTH_URL,
  },
  api: {
    url: env.API_URL,
    version: env.API_VERSION,
  },
  cache: {
    ttl: env.CACHE_TTL,
    enabled: env.ENABLE_CACHE,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    enabled: env.ENABLE_RATE_LIMIT,
  },
  logging: {
    level: env.LOG_LEVEL,
    enabled: env.ENABLE_LOGGING,
  },
} as const; 
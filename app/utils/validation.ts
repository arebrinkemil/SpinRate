import { z } from 'zod';
import { ValidationError } from './errors';

// Rating validation
export const RatingSchema = z.object({
  ratingValue: z.number().min(1).max(5),
  targetId: z.string(),
  targetType: z.enum(['ALBUM', 'SONG', 'ARTIST']),
});

export type RatingInput = z.infer<typeof RatingSchema>;

// Review validation
export const ReviewSchema = z.object({
  content: z.string().min(10).max(1000),
  targetId: z.string(),
  targetType: z.enum(['ALBUM', 'SONG', 'ARTIST']),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

// Comment validation
export const CommentSchema = z.object({
  content: z.string().min(1).max(500),
  reviewId: z.string(),
});

export type CommentInput = z.infer<typeof CommentSchema>;

// User profile validation
export const UserProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;

// Validation helper
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
      );
    }
    throw error;
  }
}

// Rate limiting validation
export const RateLimitSchema = z.object({
  limit: z.number().min(1).max(100),
  windowMs: z.number().min(1000).max(3600000), // 1 second to 1 hour
});

export type RateLimitConfig = z.infer<typeof RateLimitSchema>;

// Search validation
export const SearchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['ALBUM', 'SONG', 'ARTIST', 'ALL']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export type SearchInput = z.infer<typeof SearchSchema>; 
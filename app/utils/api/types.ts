import { z } from 'zod';

// Base schemas
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().url(),
  spotifyId: z.string(),
  spotifyUrl: z.string().url(),
});

export const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artistId: z.string(),
  releaseDate: z.string(),
  albumType: z.string(),
  spotifyId: z.string(),
  spotifyUrl: z.string().url(),
  imageUrl: z.string().url(),
});

export const SongSchema = z.object({
  id: z.string(),
  name: z.string(),
  artistId: z.string(),
  albumId: z.string(),
  durationMs: z.number(),
  releaseDate: z.string(),
  spotifyId: z.string(),
  spotifyUrl: z.string().url(),
  imageUrl: z.string().url(),
});

export const RatingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ratingValue: z.number().min(1).max(5),
  targetId: z.string(),
  targetType: z.enum(['ALBUM', 'SONG', 'ARTIST']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  targetId: z.string(),
  targetType: z.enum(['ALBUM', 'SONG', 'ARTIST']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports
export type Artist = z.infer<typeof ArtistSchema>;
export type Album = z.infer<typeof AlbumSchema>;
export type Song = z.infer<typeof SongSchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type Review = z.infer<typeof ReviewSchema>;

// Combined types
export type ContentType = 'ALBUM' | 'SONG' | 'ARTIST';

export interface ContentWithRating {
  id: string;
  type: ContentType;
  verifiedAverage: number | null;
  unverifiedAverage: number | null;
  data: Artist | Album | Song;
}

export interface UserContent {
  id: string;
  type: ContentType;
  data: Artist | Album | Song;
  rating?: number;
  review?: string;
} 
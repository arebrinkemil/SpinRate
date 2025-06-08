import { prisma } from '~/db/prisma';
import { SpotifyClient } from './spotify';
import type { Artist, Album, Song, ContentType } from './types';
import { ArtistSchema, AlbumSchema, SongSchema } from './types';
import { cache } from '../cache';
import { logger } from '../logger';

export class DataAccess {
  private static instance: DataAccess;
  private spotifyClient: SpotifyClient;
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  private constructor() {
    this.spotifyClient = SpotifyClient.getInstance();
  }

  public static getInstance(): DataAccess {
    if (!DataAccess.instance) {
      DataAccess.instance = new DataAccess();
    }
    return DataAccess.instance;
  }

  private getCacheKey(type: ContentType, id: string): string {
    return `${type}:${id}`;
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    return cache.get<T>(key);
  }

  private setCache<T>(key: string, data: T): void {
    cache.set(key, data, this.CACHE_TTL);
  }

  public async getArtist(id: string): Promise<Artist> {
    const cacheKey = this.getCacheKey('ARTIST', id);
    const cached = await this.getFromCache<Artist>(cacheKey);
    if (cached) return cached;

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new Error(`Artist not found: ${id}`);
    }

    const validated = ArtistSchema.parse(artist);
    this.setCache(cacheKey, validated);
    return validated;
  }

  public async getAlbum(id: string): Promise<Album> {
    const cacheKey = this.getCacheKey('ALBUM', id);
    const cached = await this.getFromCache<Album>(cacheKey);
    if (cached) return cached;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        songs: true,
      },
    });

    if (!album) {
      throw new Error(`Album not found: ${id}`);
    }

    const validated = AlbumSchema.parse(album);
    this.setCache(cacheKey, validated);
    return validated;
  }

  public async getSong(id: string): Promise<Song> {
    const cacheKey = this.getCacheKey('SONG', id);
    const cached = await this.getFromCache<Song>(cacheKey);
    if (cached) return cached;

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });

    if (!song) {
      throw new Error(`Song not found: ${id}`);
    }

    const validated = SongSchema.parse(song);
    this.setCache(cacheKey, validated);
    return validated;
  }

  public async searchArtists(
    query: string,
    type: string,
    page: number,
    limit: number
  ): Promise<Artist[]> {
    const skip = (page - 1) * limit;

    const artists = await prisma.artist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });

    return artists.map((artist) => ArtistSchema.parse(artist));
  }

  public async getArtistCount(query: string): Promise<number> {
    return prisma.artist.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  public async syncWithSpotify(): Promise<void> {
    try {
      const newReleases = await this.spotifyClient.getNewReleases();
      
      for (const album of newReleases.albums.items) {
        if (album.album_type === 'single') continue;

        // Create or update artist
        const artist = await prisma.artist.upsert({
          where: { spotifyId: album.artists[0].id },
          update: {
            name: album.artists[0].name,
            imageUrl: album.artists[0].images[0]?.url || '',
            spotifyUrl: album.artists[0].external_urls.spotify,
          },
          create: {
            spotifyId: album.artists[0].id,
            name: album.artists[0].name,
            imageUrl: album.artists[0].images[0]?.url || '',
            spotifyUrl: album.artists[0].external_urls.spotify,
          },
        });

        // Create or update album
        const albumData = await prisma.album.upsert({
          where: { spotifyId: album.id },
          update: {
            name: album.name,
            artistId: artist.id,
            releaseDate: album.release_date,
            albumType: album.album_type,
            spotifyUrl: album.external_urls.spotify,
            imageUrl: album.images[0]?.url || '',
          },
          create: {
            spotifyId: album.id,
            name: album.name,
            artistId: artist.id,
            releaseDate: album.release_date,
            albumType: album.album_type,
            spotifyUrl: album.external_urls.spotify,
            imageUrl: album.images[0]?.url || '',
          },
        });

        // Get and create songs
        const tracks = await this.spotifyClient.getAlbumTracks(album.id);
        for (const track of tracks.items) {
          await prisma.song.upsert({
            where: { spotifyId: track.id },
            update: {
              name: track.name,
              artistId: artist.id,
              albumId: albumData.id,
              durationMs: track.duration_ms,
              releaseDate: album.release_date,
              spotifyUrl: track.external_urls.spotify,
              imageUrl: album.images[0]?.url || '',
            },
            create: {
              spotifyId: track.id,
              name: track.name,
              artistId: artist.id,
              albumId: albumData.id,
              durationMs: track.duration_ms,
              releaseDate: album.release_date,
              spotifyUrl: track.external_urls.spotify,
              imageUrl: album.images[0]?.url || '',
            },
          });
        }
      }
    } catch (error) {
      logger.error('Error syncing with Spotify:', error);
      throw new Error('Failed to sync with Spotify');
    }
  }
} 
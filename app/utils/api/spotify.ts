import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
});

const env = envSchema.parse({
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
});

// Type definitions
export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  album: SpotifyAlbum;
}

// API Client class
export class SpotifyClient {
  private static instance: SpotifyClient;
  private token: SpotifyToken | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  public static getInstance(): SpotifyClient {
    if (!SpotifyClient.instance) {
      SpotifyClient.instance = new SpotifyClient();
    }
    return SpotifyClient.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token.access_token;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
    }

    this.token = await response.json();
    this.tokenExpiry = Date.now() + (this.token.expires_in * 1000);
    return this.token.access_token;
  }

  private async fetchWithAuth<T>(url: string): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  }

  public async getArtist(id: string): Promise<SpotifyArtist> {
    return this.fetchWithAuth<SpotifyArtist>(`https://api.spotify.com/v1/artists/${id}`);
  }

  public async getAlbum(id: string): Promise<SpotifyAlbum> {
    return this.fetchWithAuth<SpotifyAlbum>(`https://api.spotify.com/v1/albums/${id}`);
  }

  public async getAlbumTracks(id: string): Promise<{ items: SpotifyTrack[] }> {
    return this.fetchWithAuth<{ items: SpotifyTrack[] }>(
      `https://api.spotify.com/v1/albums/${id}/tracks`
    );
  }

  public async getNewReleases(): Promise<{ albums: { items: SpotifyAlbum[] } }> {
    return this.fetchWithAuth<{ albums: { items: SpotifyAlbum[] } }>(
      'https://api.spotify.com/v1/browse/new-releases'
    );
  }
} 
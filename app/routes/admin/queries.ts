import { Album, AlbumType } from "@prisma/client";
import { prisma } from "~/db/prisma";

export async function findOrCreateArtist(name: string) {
  let artist = await prisma.artist.findFirst({ where: { name } });
  if (!artist) {
    artist = await prisma.artist.create({ data: { name } });
  }
  return artist;
}

export async function findOrCreateAlbum(
  name: string,
  artistId: string,
  accessToken: string,
  releaseDate: string,
  type: AlbumType,
  spotifyUrl: string
) {
  let album = await prisma.album.findFirst({
    where: { name, artistId },
  });
  if (!album) {
    album = await prisma.album.create({
      data: { name, artistId, releaseDate, type, spotifyUrl },
    });

    const albumSongs = await fetchAlbumSongs(album.id, accessToken);
    await addSongsToDatabase(albumSongs, artistId, album.id);
  }
  return album;
}

async function fetchAlbumSongs(albumId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  return data.items;
}

export async function addSongsToDatabase(
  songs: any[],
  artistId: string,
  albumId?: string
) {
  for (const song of songs) {
    await findOrCreateSong(
      song.name,
      artistId,
      albumId,
      song.duration_ms,
      song.release_date,
      song.external_urls.spotify
    );
  }
}

export async function findOrCreateSong(
  name: string,
  artistId: string,
  albumId: string | undefined,
  duration: number,
  releaseDate: string,
  spotifyUrl: string
) {
  let song = await prisma.song.findFirst({
    where: { name, artistId },
  });
  if (!song) {
    song = await prisma.song.create({
      data: { name, artistId, albumId, duration, releaseDate, spotifyUrl },
    });
  }
  return song;
}

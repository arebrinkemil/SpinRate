import { Album, AlbumType } from "@prisma/client";
import { prisma } from "~/db/prisma";

export async function findOrCreateArtist(name: string) {
  console.log("Finding or creating artist...");
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
  spotifyUrl: string,
  albumId: string
) {
  console.log("Finding or creating album...");
  let album = await prisma.album.findFirst({
    where: { name, artistId },
  });
  if (!album) {
    album = await prisma.album.create({
      data: {
        name,
        artistId,
        releaseDate: new Date(releaseDate),
        type,
        spotifyUrl,
      },
    });

    const albumSongs = await fetchAlbumSongs(albumId, accessToken);
    await addSongsToDatabase(albumSongs, artistId, album.id);
  }
  return album;
}

async function fetchAlbumSongs(albumId: string, accessToken: string) {
  console.log(albumId + "albumId");
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  console.log(data.items + "data.items");
  return data.items;
}

export async function addSongsToDatabase(
  songs: any[],
  artistId: string,
  albumId?: string
) {
  console.log("Adding songs to database...");
  for (const song of songs) {
    console.log(JSON.stringify(song, null, 2)); // Print the entire song object
    const imageUrl = song.album?.images?.[0]?.url || "default_image_url";
    await findOrCreateSong(
      song.name,
      artistId,
      albumId,
      song.duration_ms,
      song.release_date,
      song.external_urls.spotify,
      imageUrl
    );
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export async function findOrCreateSong(
  name: string,
  artistId: string,
  albumId: string | null | undefined,
  duration: number,
  releaseDate: string,
  spotifyUrl: string,
  imageUrl: string
) {
  console.log("Finding or creating song...");
  let song = await prisma.song.findFirst({
    where: { name, artistId },
  });
  if (!song) {
    const validReleaseDate = isValidDate(releaseDate)
      ? new Date(releaseDate)
      : new Date();
    song = await prisma.song.create({
      data: {
        name,
        artistId,
        albumId,
        duration,
        releaseDate: validReleaseDate,
        spotifyUrl,
        imageUrl,
      },
    });
  }
  return song;
}

export async function getCollectedSongs() {
  console.log("Getting collected songs...");
  return await prisma.song.findMany();
}

import { Song, Review } from "@prisma/client";
import { prisma } from "~/db/prisma";

export async function getSongData(id: string) {
  return await prisma.song.findFirst({
    where: { id: id },
    include: {
      artist: true,
    },
  });
}

export async function getAlbumData(id: string) {
  return await prisma.album.findFirst({
    where: { id: id },
    include: {
      songs: true,
      artist: true,
    },
  });
}

export async function getArtistData(id: string) {
  return await prisma.artist.findFirst({
    where: { id: id },
    include: {
      albums: {
        include: {
          songs: true,
        },
      },
      songs: true,
    },
  });
}

export async function getStatsFromData() {
  const songs = await prisma.song.findMany();
  const albums = await prisma.album.findMany();
  const artists = await prisma.artist.findMany();
  const reviews = await prisma.review.findMany();

  return {
    songs: songs.length,
    albums: albums.length,
    artists: artists.length,
    reviews: reviews.length,
  };
}

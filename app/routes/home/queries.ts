import { prisma } from '~/db/prisma'

export async function getCollectedSongs() {
  return await prisma.song.findMany()
}

export async function getArtists() {
  return await prisma.artist.findMany({
    include: {
      reviews: true,
    },
  })
}

export async function getArtistSongs(artistId: string) {
  return await prisma.song.findMany({ where: { artistId } })
}

export async function getAlbums() {
  return await prisma.album.findMany({
    include: {
      songs: true,
      artist: true,
    },
  })
}

export async function getAlbumSongs(albumId: string) {
  return await prisma.song.findMany({
    where: { albumId },
    include: { artist: true },
  })
}

export async function getSingleSongs() {
  return await prisma.song.findMany({
    where: { albumId: null },
    include: { artist: true },
  })
}

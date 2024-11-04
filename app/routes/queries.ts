import { prisma } from '~/db/prisma'

export async function getSongs() {
  return await prisma.song.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      albumId: null,
    },
  })
}

export async function getArtists() {
  return await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export async function getAlbums() {
  return await prisma.album.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

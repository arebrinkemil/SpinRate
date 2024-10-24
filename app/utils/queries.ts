import { Song, Review } from '@prisma/client'
import { prisma } from '~/db/prisma'

export async function getSongData(id: string) {
  return await prisma.song.findFirst({
    where: { id: id },
  })
}

export async function getAlbumData(id: string) {
  return await prisma.album.findFirst({
    where: { id: id },
    include: {
      songs: true,
    },
  })
}

export async function getArtistData(id: string) {
  return await prisma.artist.findFirst({
    where: { id: id },
  })
}

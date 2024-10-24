import { Song } from '@prisma/client'
import { prisma } from '~/db/prisma'

export async function getAlbumData(id: string) {
  return await prisma.album.findFirst({
    where: { id: id },
    include: {
      songs: true,
    },
  })
}

export async function giveRating(
  albumId: string,
  rating: number,
  accountId: string,
) {
  await prisma.rating.create({
    data: {
      ratingValue: rating,
      userId: accountId,
      albumId: albumId,
    },
  })
}

export async function hasUserRated(
  albumId: string,
  accountId: string,
): Promise<boolean> {
  const rating = await prisma.rating.findFirst({
    where: {
      albumId: albumId,
      userId: accountId,
    },
  })
  return rating !== null
}

import { Song } from '@prisma/client'
import { prisma } from '~/db/prisma'

export async function getSongData(id: string) {
  return await prisma.song.findFirst({
    where: { id: id },
  })
}

export async function giveRating(
  songId: string,
  rating: number,
  accountId: string,
) {
  await prisma.rating.create({
    data: {
      ratingValue: rating,
      userId: accountId,
      songId: songId,
    },
  })
}

import { prisma } from '~/db/prisma'

type RatingType = 'SONG' | 'ALBUM' | 'ARTIST'

export async function getAverageRating(
  id: string,
  type: RatingType,
): Promise<number | null> {
  let ratings

  switch (type) {
    case 'SONG':
      ratings = await prisma.rating.findMany({
        where: {
          songId: id,
        },
      })
      break
    case 'ALBUM':
      ratings = await prisma.rating.findMany({
        where: {
          albumId: id,
        },
      })
      break
    case 'ARTIST':
      ratings = await prisma.rating.findMany({
        where: {
          artistId: id,
        },
      })
      break
    default:
      throw new Error('Invalid rating type')
  }

  if (ratings.length === 0) return null

  const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
  return total / ratings.length
}

export async function hasUserRated(
  id: string,
  type: RatingType,
  accountId: string,
): Promise<boolean> {
  let rating

  switch (type) {
    case 'SONG':
      rating = await prisma.rating.findFirst({
        where: {
          songId: id,
          userId: accountId,
        },
      })
      break
    case 'ALBUM':
      rating = await prisma.rating.findFirst({
        where: {
          albumId: id,
          userId: accountId,
        },
      })
      break
    case 'ARTIST':
      rating = await prisma.rating.findFirst({
        where: {
          artistId: id,
          userId: accountId,
        },
      })
      break
    default:
      throw new Error('Invalid rating type')
  }

  return rating !== null
}

export async function giveRating(
  targetId: string,
  targetType: RatingType,
  rating: number,
  accountId: string,
) {
  let ratingData

  switch (targetType) {
    case 'SONG':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          songId: targetId,
        },
      })
      break
    case 'ALBUM':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          albumId: targetId,
        },
      })
      break
    case 'ARTIST':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          artistId: targetId,
        },
      })
      break
    default:
      throw new Error('Invalid rating type')
  }

  return ratingData
}

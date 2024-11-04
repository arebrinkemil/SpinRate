import { prisma } from '~/db/prisma'

type RatingType = 'SONG' | 'ALBUM' | 'ARTIST'

export async function getAverageRating(
  id: string,
  type: RatingType,
): Promise<{
  verifiedAverage: number | null
  unverifiedAverage: number | null
}> {
  let verifiedRatings, unverifiedRatings

  switch (type) {
    case 'SONG':
      verifiedRatings = await prisma.rating.findMany({
        where: {
          songId: id,
          verified: true,
        },
      })
      unverifiedRatings = await prisma.rating.findMany({
        where: {
          songId: id,
          verified: false,
        },
      })
      break
    case 'ALBUM':
      verifiedRatings = await prisma.rating.findMany({
        where: {
          albumId: id,
          verified: true,
        },
      })
      unverifiedRatings = await prisma.rating.findMany({
        where: {
          albumId: id,
          verified: false,
        },
      })
      break
    case 'ARTIST':
      verifiedRatings = await prisma.rating.findMany({
        where: {
          artistId: id,
          verified: true,
        },
      })
      unverifiedRatings = await prisma.rating.findMany({
        where: {
          artistId: id,
          verified: false,
        },
      })
      break
    default:
      throw new Error('Invalid rating type')
  }

  const calculateAverage = (ratings: any[]) => {
    if (ratings.length === 0) return null
    const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
    return total / ratings.length
  }

  const verifiedAverage = calculateAverage(verifiedRatings)
  const unverifiedAverage = calculateAverage(unverifiedRatings)

  return { verifiedAverage, unverifiedAverage }
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
  accountId?: string | null,
  verified?: boolean,
) {
  let ratingData

  switch (targetType) {
    case 'SONG':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          songId: targetId,
          verified: verified,
        },
      })
      break
    case 'ALBUM':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          albumId: targetId,
          verified: verified,
        },
      })
      break
    case 'ARTIST':
      ratingData = await prisma.rating.create({
        data: {
          ratingValue: rating,
          userId: accountId,
          artistId: targetId,
          verified: verified,
        },
      })
      break
    default:
      throw new Error('Invalid rating type')
  }

  return ratingData
}

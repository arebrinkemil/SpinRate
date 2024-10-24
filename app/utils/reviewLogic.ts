import { prisma } from '~/db/prisma'

type reviewType = 'SONG' | 'ALBUM' | 'ARTIST'

export async function getAllReviews(id: string, type: reviewType) {
  let reviews

  switch (type) {
    case 'SONG':
      reviews = await prisma.review.findMany({
        where: {
          songId: id,
        },
        include: {
          user: true,
        },
      })
      break
    case 'ALBUM':
      reviews = await prisma.review.findMany({
        where: {
          albumId: id,
        },
        include: {
          user: true,
        },
      })
      break
    case 'ARTIST':
      reviews = await prisma.review.findMany({
        where: {
          artistId: id,
        },
        include: {
          user: true,
        },
      })
      break
    default:
      throw new Error('Invalid review type')
  }

  return reviews
}

export async function addReview(
  id: string,
  type: reviewType,
  review: string,
  accountId: string,
) {
  let reviewData

  switch (type) {
    case 'SONG':
      reviewData = await prisma.review.create({
        data: {
          content: review,
          userId: accountId,
          songId: id,
        },
      })
      break
    case 'ALBUM':
      reviewData = await prisma.review.create({
        data: {
          content: review,
          userId: accountId,
          albumId: id,
        },
      })
      break
    case 'ARTIST':
      reviewData = await prisma.review.create({
        data: {
          content: review,
          userId: accountId,
          artistId: id,
        },
      })
      break
    default:
      throw new Error('Invalid review type')
  }

  return reviewData
}

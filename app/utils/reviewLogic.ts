import { prisma } from '~/db/prisma'
import type { Review, Album, Song, Artist, Account } from '@prisma/client'

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
          comments: {
            include: {
              user: true,
            },
          },
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
          comments: {
            include: {
              user: true,
            },
          },
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
          comments: {
            include: {
              user: true,
            },
          },
        },
      })
      break
    default:
      throw new Error('Invalid review type')
  }

  return reviews
}

type ReviewData =
  | {
      kind: 'review'
      type: 'album'
      data: Album
      reviewValue: string
      id: string
    }
  | {
      kind: 'review'
      type: 'song'
      data: Song
      reviewValue: string
      id: string
    }
  | {
      kind: 'review'
      type: 'artist'
      data: Artist
      reviewValue: string
      id: string
    }

export async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
      album: true,
      song: true,
      artist: true,
    },
  })

  const userReviews: ReviewData[] = reviews
    .map(review => {
      if (review.album) {
        return {
          kind: 'review',
          type: 'album',
          data: review.album,
          reviewValue: review.content,
          id: review.id,
        }
      } else if (review.song) {
        return {
          kind: 'review',
          type: 'song',
          data: review.song,
          reviewValue: review.content,
          id: review.id,
        }
      } else if (review.artist) {
        return {
          kind: 'review',
          type: 'artist',
          data: review.artist,
          reviewValue: review.content,
          id: review.id,
        }
      }
      return null
    })
    .filter((review): review is ReviewData => review !== null)

  return userReviews
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

export async function getReviewById(reviewId: string) {
  return await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: true,
    },
  })
}

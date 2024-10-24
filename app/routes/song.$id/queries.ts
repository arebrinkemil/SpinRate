import { Song, Review } from '@prisma/client'
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

export async function hasUserRated(
  songId: string,
  accountId: string,
): Promise<boolean> {
  const rating = await prisma.rating.findFirst({
    where: {
      songId: songId,
      userId: accountId,
    },
  })
  return rating !== null
}

export async function addReview(
  songId: string,
  review: string,
  accountId: string,
): Promise<Review> {
  return await prisma.review.create({
    data: {
      content: review,
      userId: accountId,
      songId: songId,
    },
  })
}

export type ReviewWithUser = Review & {
  user: {
    username: string
  }
}

export async function getAllReviews(songId: string): Promise<ReviewWithUser[]> {
  return await prisma.review.findMany({
    where: { songId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  })
}

import { prisma } from '~/db/prisma'
import type { Account, Rating, Album, Song, Artist } from '@prisma/client'

export async function getUserData(id: string): Promise<Account | null> {
  return await prisma.account.findUnique({
    where: { id: id },
  })
}

type RatingData =
  | { type: 'album'; data: Album; ratingValue: number }
  | { type: 'song'; data: Song; ratingValue: number }
  | { type: 'artist'; data: Artist; ratingValue: number }

export async function getUserRatings(id: string): Promise<RatingData[]> {
  const ratings = await prisma.rating.findMany({
    where: { userId: id },
    include: {
      album: true,
      song: true,
      artist: true,
    },
  })

  const userRatings: RatingData[] = ratings
    .map(rating => {
      if (rating.album) {
        return {
          type: 'album',
          data: rating.album,
          ratingValue: rating.ratingValue,
        }
      } else if (rating.song) {
        return {
          type: 'song',
          data: rating.song,
          ratingValue: rating.ratingValue,
        }
      } else if (rating.artist) {
        return {
          type: 'artist',
          data: rating.artist,
          ratingValue: rating.ratingValue,
        }
      }
      return null
    })
    .filter((rating): rating is RatingData => rating !== null)

  return userRatings
}

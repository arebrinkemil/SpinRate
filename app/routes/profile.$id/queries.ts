import { prisma } from '~/db/prisma'
import type { Account, Rating, Album, Song, Artist } from '@prisma/client'

export async function getUserData(id: string): Promise<Account | null> {
  return await prisma.account.findUnique({
    where: { id: id },
  })
}

type RatingData =
  | {
      kind: 'rating'
      type: 'album'
      data: Album
      ratingValue: number
      id: string
    }
  | {
      kind: 'rating'
      type: 'song'
      data: Song
      ratingValue: number
      id: string
    }
  | {
      kind: 'rating'
      type: 'artist'
      data: Artist
      ratingValue: number
      id: string
    }

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
          kind: 'rating',
          type: 'album',
          data: rating.album,
          ratingValue: rating.ratingValue,
          id: rating.id,
        }
      } else if (rating.song) {
        return {
          kind: 'rating',
          type: 'song',
          data: rating.song,
          ratingValue: rating.ratingValue,
          id: rating.id,
        }
      } else if (rating.artist) {
        return {
          kind: 'rating',
          type: 'artist',
          data: rating.artist,
          ratingValue: rating.ratingValue,
          id: rating.id,
        }
      }
      return null
    })
    .filter((rating): rating is RatingData => rating !== null)

  return userRatings
}

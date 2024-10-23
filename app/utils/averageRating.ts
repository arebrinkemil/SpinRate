import { prisma } from '~/db/prisma'

export async function getAverageSongRating(
  songId: string,
): Promise<number | null> {
  const ratings = await prisma.rating.findMany({
    where: {
      songId: songId,
    },
  })
  if (ratings.length === 0) return null
  const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
  return total / ratings.length
}

export async function getAverageAlbumRating(
  albumId: string,
): Promise<number | null> {
  const ratings = await prisma.rating.findMany({
    where: {
      albumId: albumId,
    },
  })
  if (ratings.length === 0) return null // Handle case with no ratings
  const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
  return total / ratings.length
}

export async function getAverageArtistRating(
  artistId: string,
): Promise<number | null> {
  const ratings = await prisma.rating.findMany({
    where: {
      artistId: artistId,
    },
  })
  if (ratings.length === 0) return null // Handle case with no ratings
  const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
  return total / ratings.length
}

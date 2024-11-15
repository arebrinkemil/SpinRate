import { prisma } from '~/db/prisma'
import type {
  Review,
  Album,
  Song,
  Artist,
  Account,
  Favorite,
} from '@prisma/client'

export async function getFavorites(id: string): Promise<Favorite[]> {
  return await prisma.favorite.findMany({
    where: { userId: id },
    include: {
      album: true,
      song: true,
      artist: true,
    },
  })
}

export async function addFavorite(
  targetId: string,
  accountId: string,
  type: 'album' | 'song' | 'artist',
) {
  let favoriteData

  favoriteData = await prisma.favorite.create({
    data: {
      userId: accountId,
      [`${type}Id`]: targetId,
    },
  })

  return favoriteData
}

export async function removeFavorite(
  targetId: string,
  accountId: string,
  type: 'album' | 'song' | 'artist',
) {
  let favoriteData

  favoriteData = await prisma.favorite.deleteMany({
    where: {
      userId: accountId,
      [`${type}Id`]: targetId,
    },
  })

  return favoriteData
}

export async function hasFavorite(
  targetId: string,
  accountId: string,
  type: 'album' | 'song' | 'artist',
) {
  const favorite = await prisma.favorite.findFirst({
    where: {
      userId: accountId,
      [`${type}Id`]: targetId,
    },
  })

  return favorite
}

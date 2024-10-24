// utils/reviewLoader.ts
import { requireAuthCookie } from '~/auth/auth'
import { getSongData, getAlbumData, getArtistData } from './queries'
import { getAverageRating, hasUserRated } from './ratingLogic'
import { getAllReviews } from './reviewLogic'

export async function loadReviewData(
  request: Request,
  targetId: string,
  targetType: 'SONG' | 'ALBUM' | 'ARTIST',
) {
  const accountId = await requireAuthCookie(request)

  let targetData: any
  if (targetType === 'SONG') {
    targetData = await getSongData(targetId)
  } else if (targetType === 'ALBUM') {
    targetData = await getAlbumData(targetId)
  } else if (targetType === 'ARTIST') {
    targetData = await getArtistData(targetId)
  }

  if (!targetData) throw new Error(`${targetType} not found`)

  const hasRated = await hasUserRated(targetId, targetType, accountId)
  const averageRating = await getAverageRating(targetId, targetType)
  const reviews = await getAllReviews(targetId, targetType)

  return {
    targetData,
    hasRated,
    averageRating,
    reviews,
  }
}

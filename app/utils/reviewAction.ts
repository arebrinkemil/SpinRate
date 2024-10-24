import { requireAuthCookie } from '~/auth/auth'
import { giveRating } from './ratingLogic'
import { addReview } from './reviewLogic'

export async function handleRatingAction(
  targetId: string,
  targetType: 'SONG' | 'ALBUM' | 'ARTIST',
  formData: FormData,
  request: Request,
) {
  try {
    const accountId = await requireAuthCookie(request)
    const ratingValue = formData.get('rating')

    if (!ratingValue) {
      throw new Error('Rating value is missing')
    }

    console.log('Processing rating:', ratingValue)

    await giveRating(
      targetId,
      targetType,
      parseInt(ratingValue as string, 10),
      accountId,
    )
  } catch (error) {
    console.error('handleRatingAction Error:', error)
    throw error
  }
}
export async function handleReviewAction(
  targetId: string,
  targetType: 'SONG' | 'ALBUM' | 'ARTIST',
  formData: FormData,
  request: Request,
) {
  try {
    const accountId = await requireAuthCookie(request)
    const reviewContent = formData.get('review')

    if (!reviewContent) {
      throw new Error('Review content is missing')
    }

    console.log('Processing review:', reviewContent)

    await addReview(targetId, targetType, reviewContent as string, accountId)
  } catch (error) {
    console.error('handleReviewAction Error:', error)
    throw error
  }
}

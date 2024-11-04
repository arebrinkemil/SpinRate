import { requireAuthCookie, getAuthFromRequest } from '~/auth/auth'
import { giveRating } from './ratingLogic'
import { addReview } from './reviewLogic'
import { addComment } from './commentLogic'
import exp from 'constants'

export async function handleRatingAction(
  targetId: string,
  targetType: 'SONG' | 'ALBUM' | 'ARTIST',
  formData: FormData,
  request: Request,
) {
  try {
    const userId = await getAuthFromRequest(request)
    const verified = userId !== null

    const ratingValue = formData.get('rating')

    if (!ratingValue) {
      throw new Error('Rating value is missing')
    }

    await giveRating(
      targetId,
      targetType,
      parseInt(ratingValue as string, 10),
      userId,
      verified,
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

    await addReview(targetId, targetType, reviewContent as string, accountId)
  } catch (error) {
    console.error('handleReviewAction Error:', error)
    throw error
  }
}

export async function handleCommentAction(
  targetId: string,
  formData: FormData,
  request: Request,
) {
  try {
    const accountId = await requireAuthCookie(request)
    const commentContent = formData.get('comment')

    if (!commentContent) {
      throw new Error('Comment content is missing')
    }

    await addComment(targetId, commentContent as string, accountId)
  } catch (error) {
    console.error('handleCommentAction Error:', error)
    throw error
  }
}

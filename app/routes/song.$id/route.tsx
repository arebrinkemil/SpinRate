import { useLoaderData, useActionData, Form } from '@remix-run/react'
import AverageRating from '~/components/AverageRating'
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from '@remix-run/node'
import { loadReviewData } from '~/utils/reviewLoader'
import { handleRatingAction, handleReviewAction } from '~/utils/reviewAction'
import { notFound } from '~/http/bad-request'
import RatingForm from '~/components/RatingForm'
import ReviewForm from '~/components/ReviewForm'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const targetId = String(params.id)
  const targetType = 'SONG'

  if (!targetId || !['SONG', 'ALBUM', 'ARTIST'].includes(targetType))
    throw notFound()

  const data = await loadReviewData(
    request,
    targetId,
    targetType as 'SONG' | 'ALBUM' | 'ARTIST',
  )
  return data
}

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const formData = await request.formData()

    const targetId = String(params.id)
    const targetType = 'SONG'
    const intent = formData.get('intent')

    if (!targetId) return new Response('Invalid action', { status: 400 })

    if (intent === 'rate') {
      await handleRatingAction(targetId, targetType, formData, request)
      return redirect(`/song/${targetId}`)
    } else if (intent === 'review') {
      await handleReviewAction(targetId, targetType, formData, request)
      return redirect(`/song/${targetId}`)
    }

    return new Response('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Action Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export default function Song() {
  const { targetData, hasRated, averageRating, reviews } =
    useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{targetData.name}</h1>
      <Link to={`/artist/${targetData.artistId}`}>
        <h2>{targetData.artist.name ?? 'Artist Name not found'}</h2>
      </Link>

      <img src={targetData.imageUrl ?? ''} alt={targetData.name} />
      <AverageRating averageRating={averageRating} />

      <RatingForm
        targetId={targetData.id}
        targetType='SONG'
        hasRated={hasRated}
      />

      <h2>Leave a review</h2>

      <ReviewForm targetId={targetData.id} targetType='SONG' />

      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <p>{review.content}</p>
            <p>By: {review.user.username}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

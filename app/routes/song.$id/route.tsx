import { useLoaderData, useActionData, Form } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { notFound } from '~/http/bad-request'
import {
  getSongData,
  giveRating,
  hasUserRated,
  addReview,
  getAllReviews,
  ReviewWithUser,
} from './queries'
import { requireAuthCookie } from '~/auth/auth'
import AverageRating from '~/components/AverageRating'
import { getAverageSongRating } from '~/utils/averageRating'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const songId = String(params.id)

  if (!params.id) throw notFound()

  const song = await getSongData(songId)
  if (!song) throw notFound()

  const hasRated = await hasUserRated(songId, accountId)
  const averageRating = await getAverageSongRating(songId)
  const reviews = await getAllReviews(songId)

  return { song, hasRated, averageRating, reviews }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const formData = await request.formData()

  if (formData.get('intent') === 'rate') {
    const ratingValue = parseInt(formData.get('rating') as string, 10)

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
      return new Response('Invalid rating', { status: 400 })
    }

    const songId = String(params.id)
    await giveRating(songId, ratingValue, accountId)

    return redirect(`/song/${songId}`)
  } else if (formData.get('intent') === 'review') {
    const review = formData.get('review') as string

    if (!review || review.trim().length === 0) {
      return new Response('Invalid review', { status: 400 })
    }

    const songId = String(params.id)
    await addReview(songId, review, accountId)

    return redirect(`/song/${songId}`)
  }

  return new Response('Invalid action', { status: 400 })
}

export default function Song() {
  const { song, hasRated, averageRating, reviews } = useLoaderData<{
    song: any
    hasRated: boolean
    averageRating: number
    reviews: ReviewWithUser[]
  }>()
  const actionData = useActionData()

  return (
    <div>
      <h1>{song.name}</h1>
      <img src={song.imageUrl ?? ''} alt={song.name} />
      <AverageRating averageRating={averageRating} />{' '}
      {hasRated ? (
        <p>You have already rated this song.</p>
      ) : (
        <Form method='post'>
          <label>
            Rate this song (1-10):
            <input type='number' name='rating' min='1' max='10' required />
          </label>
          <input type='hidden' name='intent' value='rate' />
          <button type='submit'>Submit Rating</button>
        </Form>
      )}
      <h2>Leave a review</h2>
      <Form method='post'>
        <label>
          Your review:
          <textarea name='review' rows={3} required />
        </label>
        <input type='hidden' name='intent' value='review' />
        <button type='submit'>Submit review</button>
      </Form>
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

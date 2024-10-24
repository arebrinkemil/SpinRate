import { useLoaderData, useActionData, Form, Link } from '@remix-run/react'
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
import { truncateText } from '~/utils/truncate'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const targetId = String(params.id)
  const targetType = 'ALBUM'

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
    const targetType = 'ALBUM'
    const intent = formData.get('intent')

    if (!targetId) return new Response('Invalid action', { status: 400 })

    if (intent === 'rate') {
      await handleRatingAction(targetId, targetType, formData, request)
      return redirect(`/album/${targetId}`)
    } else if (intent === 'review') {
      await handleReviewAction(targetId, targetType, formData, request)
      return redirect(`/album/${targetId}`)
    }

    return new Response('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Action Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export default function Album() {
  const { targetData, hasRated, averageRating, reviews } =
    useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{targetData.name}</h1>
      <img src={targetData.imageUrl ?? ''} alt={targetData.name} />
      {targetData.songs.map((song: any) => (
        <Link to={`/song/${song.id}`} key={song.id}>
          <li className='bg-blue hover:bg-hallon relative flex h-full flex-col items-center justify-between gap-5 p-2 text-white'>
            <div className='rounded bg-black bg-opacity-50 p-2'>
              {truncateText(song.name, 16)}
            </div>
          </li>
        </Link>
      ))}
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

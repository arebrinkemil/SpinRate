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
import CornerMarkings from '~/components/CornerMarkings'

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
      <h1 className='mx-4 text-3xl'>Album</h1>

      <div className='m-8 flex flex-row justify-between'>
        <div className='flex flex-row gap-4'>
          <CornerMarkings className='aspect-square w-1/4' hoverEffect={true}>
            <img
              className='aspect-square'
              src={targetData.imageUrl ?? ''}
              alt={targetData.name}
            />
          </CornerMarkings>
          <div>
            <h1>{targetData.name ?? 'Artist Name not found'}</h1>
            <Link to={`/artist/${targetData.artistId}`}>
              <h2>{targetData.artist.name ?? 'Artist Name not found'}</h2>
            </Link>
          </div>
        </div>
        <AverageRating averageRating={averageRating} />
      </div>
      <h1 className='mx-4 text-3xl'>Songs</h1>
      <CornerMarkings className=' mx-4' hoverEffect={false}>
        {targetData.songs.map((song: any) => (
          <Link to={`/song/${song.id}`} key={song.id}>
            <li className='hover:bg-lightsilver mx-4 flex flex-row items-center justify-between px-2 py-2'>
              <div className=''>{truncateText(song.name, 40)}</div>
              <img
                className='aspect-square w-10'
                src={song.imageUrl ?? ''}
                alt={song.name}
              />
            </li>
          </Link>
        ))}
      </CornerMarkings>

      <RatingForm
        targetId={targetData.id}
        targetType='ALBUM'
        hasRated={hasRated}
      />

      <h2>Leave a review</h2>

      <ReviewForm targetId={targetData.id} targetType='ALBUM' />

      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li className='flex w-full flex-row gap-4' key={review.id}>
            <p>{review.content}</p>
            <p>By: {review.user.username}</p>
            <img
              src={review.user.profileImageUrl ?? ''}
              alt={review.user.username}
              className='aspect-square w-10 object-cover'
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

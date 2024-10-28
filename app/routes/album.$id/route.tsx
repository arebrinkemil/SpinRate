import { useLoaderData, Form, Link } from '@remix-run/react'
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from '@remix-run/node'
import AverageRating from '~/components/AverageRating'
import { loadReviewData } from '~/utils/reviewLoader'
import {
  handleRatingAction,
  handleReviewAction,
  handleCommentAction,
} from '~/utils/reviewAction'
import { notFound } from '~/http/bad-request'
import RatingForm from '~/components/RatingForm'
import ReviewForm from '~/components/ReviewForm'
import CornerMarkings from '~/components/CornerMarkings'
import ReviewDisplay from '~/components/ReviewDisplay'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const targetId = String(params.id)
  const targetType = 'ALBUM'

  if (!targetId) throw notFound()

  const data = await loadReviewData(request, targetId, targetType)

  return data
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const targetId = String(params.id)
  const targetType = 'ALBUM'
  const intent = formData.get('intent')
  const reviewId = String(formData.get('reviewId'))

  if (!targetId) return new Response('Invalid action', { status: 400 })

  if (intent === 'rate') {
    await handleRatingAction(targetId, targetType, formData, request)
    return redirect(`/album/${targetId}`)
  } else if (intent === 'review') {
    await handleReviewAction(targetId, targetType, formData, request)
    return redirect(`/album/${targetId}`)
  } else if (intent === 'comment') {
    if (!reviewId) return new Response('Invalid action', { status: 400 })
    await handleCommentAction(reviewId, formData, request)
    return redirect(`/album/${targetId}`)
  }

  return new Response('Invalid action', { status: 400 })
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
              className='aspect-square object-cover'
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
      <CornerMarkings className='mx-4' hoverEffect={false}>
        {targetData.songs.map((song: any) => (
          <Link to={`/song/${song.id}`} key={song.id}>
            <li className='hover:bg-lightsilver mx-4 flex flex-row items-center justify-between px-2 py-2'>
              <div>{song.name}</div>
              <img
                className='aspect-square w-10'
                src={song.imageUrl ?? ''}
                alt={song.name}
              />
            </li>
          </Link>
        ))}
      </CornerMarkings>

      <div className='mx-4 flex w-full flex-row justify-center'>
        <div className='flex basis-1/2 flex-col'>
          <RatingForm
            targetId={targetData.id}
            targetType='ALBUM'
            hasRated={hasRated}
          />

          <h2>Leave a review</h2>

          <ReviewForm targetId={targetData.id} targetType='ALBUM' />

          <h2>Reviews</h2>
        </div>
        <ul className='mx-8 flex basis-1/2 flex-col'>
          <h3 className='text-xl underline'>Reviews</h3>
          {reviews.map(review => (
            <ReviewDisplay key={review.id} review={review} />
          ))}
        </ul>
      </div>
    </div>
  )
}

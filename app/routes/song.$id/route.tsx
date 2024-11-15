import { useLoaderData, useActionData, Form, Link } from '@remix-run/react'
import AverageRating from '~/components/AverageRating'
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from '@remix-run/node'
import { loadReviewData } from '~/utils/reviewLoader'
import {
  handleRatingAction,
  handleReviewAction,
  handleCommentAction,
} from '~/utils/reviewAction'
import { notFound } from '~/http/bad-request'
import RatingForm from '~/components/RatingForm'
import ReviewForm from '~/components/ReviewForm'
import ReviewDisplay from '~/components/ReviewDisplay'
import CornerMarkings from '~/components/CornerMarkings'
import MobileRatingReviewBar from '~/components/MobileRatingReviewBar'
import { truncateText } from '~/utils/truncate'
import FavoriteButton from '~/components/FavoriteButton'
import { hasFavorite, addFavorite, removeFavorite } from '~/utils/favoriteLogic'
import { getAuthFromRequest } from '~/auth/auth'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const targetId = String(params.id)
  const targetType = 'SONG'

  if (!targetId || !['SONG', 'ALBUM', 'ARTIST'].includes(targetType)) {
    throw notFound()
  }

  const userId = await getAuthFromRequest(request)

  const isFavorited = userId
    ? await hasFavorite(targetId, userId, 'song')
    : false

  const data = await loadReviewData(request, targetId, targetType)
  return { ...data, isFavorited }
}

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const formData = await request.formData()

    const targetId = String(params.id)
    const targetType = 'SONG'
    const intent = formData.get('intent')
    const reviewId = String(formData.get('reviewId'))
    const userId = await getAuthFromRequest(request)

    if (!targetId) return new Response('Invalid action', { status: 400 })

    if (intent === 'rate') {
      await handleRatingAction(targetId, targetType, formData, request)
      return redirect(`/song/${targetId}`)
    } else if (intent === 'review') {
      await handleReviewAction(targetId, targetType, formData, request)
      return redirect(`/song/${targetId}`)
    } else if (intent === 'comment') {
      if (!reviewId) return new Response('Invalid action', { status: 400 })
      await handleCommentAction(reviewId, formData, request)
      return redirect(`/song/${targetId}`)
    } else if (intent === 'favorite') {
      if (userId) {
        await addFavorite(
          targetId,
          userId,
          targetType.toLowerCase() as 'album' | 'song' | 'artist',
        )
      } else {
        return new Response('User not authenticated', { status: 401 })
      }
      return redirect(`/song/${targetId}`)
    } else if (intent === 'unfavorite') {
      if (userId) {
        await removeFavorite(
          targetId,
          userId,
          targetType.toLowerCase() as 'album' | 'song' | 'artist',
        )
      } else {
        return new Response('User not authenticated', { status: 401 })
      }
      return redirect(`/song/${targetId}`)
    }

    return new Response('Invalid action', { status: 400 })
  } catch (error) {
    console.error('Action Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
export default function Song() {
  const {
    targetData,
    hasRated,
    isFavorited,
    verifiedAverage,
    unverifiedAverage,
    reviews,
    verified,
  } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className='mx-4 text-3xl'>Song</h1>

      <div className='m-4 flex flex-col justify-between md:m-8'>
        <div className='hidden flex-row gap-4 md:flex'>
          <div className='w-96 shrink'>
            <CornerMarkings mediaType='SONG' className='' hoverEffect={true}>
              <img
                className='aspect-square object-cover'
                src={targetData.imageUrl ?? ''}
                alt={targetData.name}
              />
            </CornerMarkings>
          </div>

          <div className='flex basis-3/4 flex-row justify-between'>
            <div className='flex flex-col'>
              <h2>{targetData.name ?? 'Artist Name not found'}</h2>
              <Link to={`/artist/${targetData.artistId}`}>
                <h3>{targetData.artist.name ?? 'Artist Name not found'}</h3>
              </Link>
              {targetData.albumId && (
                <Link to={`/album/${targetData.albumId}`}>
                  <p className='underline'>Go to Album</p>
                </Link>
              )}
              <p>
                Release Date:{' '}
                {targetData.releaseDate ?? 'Release Date not found'}
              </p>
              <p>Duration: {formatDuration(targetData.duration)}</p>
              <FavoriteButton
                targetId={targetData.id}
                targetType='SONG'
                isFavorite={!!isFavorited}
                verified={verified}
              />
            </div>
            <div className='flex flex-row items-center md:flex-col'>
              <AverageRating type='VERIFIED' averageRating={verifiedAverage} />
              <AverageRating type='PUBLIC' averageRating={unverifiedAverage} />
            </div>
          </div>
        </div>

        <div className='flex flex-col md:hidden'>
          <div className='flex w-full gap-4'>
            <div className='shrink basis-2/5'>
              <CornerMarkings mediaType='SONG' className='' hoverEffect={true}>
                <img
                  className='aspect-square object-cover'
                  src={targetData.imageUrl ?? ''}
                  alt={targetData.name}
                />
              </CornerMarkings>
            </div>

            <div className='flex basis-3/5 flex-row justify-between'>
              <div className='flex flex-col'>
                <h2>{targetData.name ?? 'Artist Name not found'}</h2>
                <Link to={`/artist/${targetData.artistId}`}>
                  <h3>{targetData.artist.name ?? 'Artist Name not found'}</h3>
                </Link>
                {targetData.albumId && (
                  <Link to={`/album/${targetData.albumId}`}>
                    <p className='underline'>Go to Album</p>
                  </Link>
                )}
                <p>
                  Release Date:{' '}
                  {truncateText(
                    targetData.releaseDate ?? 'Release Date not found',
                    16,
                  )}
                </p>
                <p>Duration: {formatDuration(targetData.duration)}</p>
                <FavoriteButton
                  targetId={targetData.id}
                  targetType='SONG'
                  isFavorite={!!isFavorited}
                  verified={verified}
                />
              </div>
            </div>
          </div>
          <div className='flex w-full flex-row md:flex-col'>
            <AverageRating type='VERIFIED' averageRating={verifiedAverage} />
            <AverageRating type='PUBLIC' averageRating={unverifiedAverage} />
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 md:flex-row'>
          <div className='basis-1/2 '>
            <div className=' mb-8 hidden w-full basis-1/2 justify-center md:flex'>
              <RatingForm
                targetId={targetData.id}
                targetType='SONG'
                hasRated={hasRated}
              />
            </div>
            <div className='iframe-container'>
              <iframe
                src={`https://open.spotify.com/embed/track/${targetData.id}?utm_source=generator&theme=0`}
                width='100%'
                height='160'
                frameBorder='0'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
              ></iframe>
            </div>
          </div>
          <div className='basis-1/2'>
            <div className='flex w-full flex-col justify-center md:mx-4'>
              <div className='hidden flex-col md:flex'>
                <h3 className='text-platinum mb-10 md:text-black'>
                  Leave a review
                </h3>

                {verified ? (
                  <ReviewForm targetId={targetData.id} targetType='SONG' />
                ) : (
                  <p>
                    Please <Link to='/login'>login</Link> to leave a review.
                  </p>
                )}

                <h2>Reviews</h2>
              </div>
              <ul className='mb-12 flex basis-1/2 flex-col md:mb-0'>
                <h3 className='text-xl underline'>Reviews</h3>
                {reviews.map(review => (
                  <ReviewDisplay key={review.id} review={review} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <MobileRatingReviewBar
        targetId={targetData.id}
        targetType='SONG'
        hasRated={hasRated}
        verified={verified}
      />
    </div>
  )
}

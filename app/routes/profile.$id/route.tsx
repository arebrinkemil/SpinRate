import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireAuthCookie } from '~/auth/auth'
import { getUserData, getUserRatings } from './queries'
import { getUserReviews } from '~/utils/reviewLogic'
import type { Account } from '@prisma/client'
import type { Album, Song, Artist, Review } from '@prisma/client'
import CornerMarkings from '~/components/CornerMarkings'
import { RatingBox, ReviewBox } from '~/components/ContentBoxes'
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

type RatingData =
  | {
      kind: 'rating'
      type: 'ALBUM'
      data: Album
      ratingValue: number
      id: string
    }
  | {
      kind: 'rating'
      type: 'SONG'
      data: Song
      ratingValue: number
      id: string
    }
  | {
      kind: 'rating'
      type: 'ARTIST'
      data: Artist
      ratingValue: number
      id: string
    }

type ReviewData =
  | {
      kind: 'review'
      type: 'ALBUM'
      data: Album
      reviewValue: string
      id: string
    }
  | {
      kind: 'review'
      type: 'SONG'
      data: Song
      reviewValue: string
      id: string
    }
  | {
      kind: 'review'
      type: 'ARTIST'
      data: Artist
      reviewValue: string
      id: string
    }

function shuffleArray<T>(array: T[] = []): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const userId = String(params.id)

  if (!params.id) throw new Response('User not found', { status: 404 })

  const user = await getUserData(userId)
  if (!user) throw new Response('User not found', { status: 404 })

  const ratings = await getUserRatings(userId)
  const reviews = await getUserReviews(userId)

  const combinedData = shuffleArray([...ratings, ...reviews])

  combinedData.forEach(element => {
    console.log(element)
  })

  const isOwner = accountId === userId

  return { user, isOwner, combinedData }
}

export default function Profile() {
  const { user, isOwner, combinedData } = useLoaderData<{
    user: Account
    isOwner: boolean
    combinedData: (RatingData | ReviewData)[]
  }>()

  return (
    <div className='m-10 flex flex-col gap-10'>
      <CornerMarkings
        mediaType='DEFAULT'
        hoverEffect={false}
        className='flex flex-row justify-between'
      >
        <div className='flex flex-col'>
          <h1>USERAME: {user.username}</h1>
          <h2>MAIL: {user.email}</h2>

          <p>
            FIRSTNAME: {user.firstName} <br></br> LASTNAME: {user.lastName}
          </p>
          <p>DESCRIPTION: {user.description}</p>
          {isOwner && (
            <Link to={`/profile/edit`} className='btn-primary'>
              Edit Profile
            </Link>
          )}
        </div>
        {user.profileImageUrl && (
          <img
            className='w-1/3'
            src={user.profileImageUrl}
            alt={user.username}
          />
        )}
      </CornerMarkings>

      {(isOwner && <h1 className='text-3xl'>Your Ratings and Reviews</h1>) || (
        <h1 className='text-3xl'>Ratings and Reviews</h1>
      )}

      <div className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
        {combinedData.map(item => {
          const uniqueKey = `${item.kind}-${item.data.id}`

          if (item.kind === 'rating') {
            return <RatingBox key={uniqueKey} rating={item} type={item.type} />
          }

          if (item.kind === 'review') {
            return <ReviewBox key={uniqueKey} review={item} type={item.type} />
          }

          return null
        })}
      </div>
    </div>
  )
}

import { useLoaderData, Link } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireAuthCookie } from '~/auth/auth'
import { getUserData, getUserRatings } from './queries'
import type { Account } from '@prisma/client'
import type { Album, Song, Artist } from '@prisma/client'
import CornerMarkings from '~/components/CornerMarkings'

type RatingData =
  | { type: 'album'; data: Album; ratingValue: number }
  | { type: 'song'; data: Song; ratingValue: number }
  | { type: 'artist'; data: Artist; ratingValue: number }

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const userId = String(params.id)

  if (!params.id) throw new Response('User not found', { status: 404 })

  const user = await getUserData(userId)
  if (!user) throw new Response('User not found', { status: 404 })

  const ratings = await getUserRatings(userId)

  const isOwner = accountId === userId

  return { user, ratings, isOwner }
}

export default function Profile() {
  const { user, ratings, isOwner } = useLoaderData<{
    user: Account
    ratings: RatingData[]
    isOwner: boolean
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

      <div className='flex w-full flex-col justify-center'>
        <h1>Your Ratings</h1>

        <ul className='flex w-2/3 flex-col gap-4'>
          {ratings.map((rating, index) => (
            <li key={index}>
              {rating.type === 'album' && (
                <CornerMarkings mediaType='ALBUM' hoverEffect={true}>
                  <div className='flex w-full flex-row justify-between'>
                    <div>
                      <h2>
                        {rating.data.name} - {rating.data.name}
                      </h2>
                      <p>Rating: {rating.ratingValue}</p>
                    </div>
                    <img
                      src={rating.data.imageUrl ?? ''}
                      alt={rating.data.name}
                      className='h-20 w-20'
                    />
                  </div>
                </CornerMarkings>
              )}
              {rating.type === 'song' && (
                <CornerMarkings mediaType='SONG' hoverEffect={true}>
                  <Link to={`/song/${rating.data.id}`}>
                    <div className='flex w-full flex-row justify-between'>
                      <div>
                        <h2>
                          {rating.data.name} - {rating.data.artistName}
                        </h2>
                        <p>Rating: {rating.ratingValue}</p>
                      </div>
                      <img
                        src={rating.data.imageUrl ?? ''}
                        alt={rating.data.name}
                        className='h-20 w-20'
                      />
                    </div>
                  </Link>
                </CornerMarkings>
              )}
              {rating.type === 'artist' && (
                <CornerMarkings mediaType='ARTIST' hoverEffect={true}>
                  <div>
                    <h2>Artist: {rating.data.name}</h2>
                    <p>Rating: {rating.ratingValue}</p>
                  </div>
                </CornerMarkings>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

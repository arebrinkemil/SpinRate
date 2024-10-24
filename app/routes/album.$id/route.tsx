import { useLoaderData, useActionData, Form, Link } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { notFound } from '~/http/bad-request'
import { getAlbumData, giveRating, hasUserRated } from './queries'
import { requireAuthCookie } from '~/auth/auth'
import AverageRating from '~/components/AverageRating'
import { truncateText } from '~/utils/truncate'
import { getAverageAlbumRating } from '~/utils/averageRating'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  console.log('accountId', accountId)
  const albumId = String(params.id)

  if (!params.id) throw notFound()

  const album = await getAlbumData(albumId)
  if (!album) throw notFound()

  const hasRated = await hasUserRated(albumId, accountId)
  const averageRating = await getAverageAlbumRating(albumId)

  return { album, hasRated, averageRating }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const formData = await request.formData()
  const ratingValue = parseInt(formData.get('rating') as string, 10)

  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
    return new Response('Invalid rating', { status: 400 })
  }

  const albumId = String(params.id)
  await giveRating(albumId, ratingValue, accountId)

  return redirect(`/album/${albumId}`)
}

export default function Album() {
  const { album, hasRated, averageRating } = useLoaderData<typeof loader>()
  const actionData = useActionData()

  return (
    <div>
      <h1>{album.name}</h1>
      <img src={album.imageUrl ?? ''} alt={album.name} />
      {album.songs.map((song: any) => (
        <Link to={`/song/${song.id}`} key={song.id}>
          <li className='bg-blue hover:bg-hallon relative flex h-full flex-col items-center justify-between gap-5 p-2 text-white'>
            <div className='rounded bg-black bg-opacity-50 p-2'>
              {truncateText(song.name, 16)}
            </div>
          </li>
        </Link>
      ))}
      <AverageRating averageRating={averageRating} />{' '}
      {hasRated ? (
        <p>You have already rated this album.</p>
      ) : (
        <Form method='post'>
          <label>
            Rate this album (1-10):
            <input type='number' name='rating' min='1' max='10' required />
          </label>
          <button type='submit'>Submit Rating</button>
        </Form>
      )}
    </div>
  )
}

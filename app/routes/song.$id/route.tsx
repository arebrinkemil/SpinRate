import { useLoaderData, useActionData, Form } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { notFound } from '~/http/bad-request'
import { getSongData, giveRating, hasUserRated } from './queries'
import { requireAuthCookie } from '~/auth/auth'
import AverageRating from '~/components/AverageRating'
import { getAverageRating } from '~/utils/averageRating'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  console.log('accountId', accountId)
  const songId = String(params.id)

  if (!params.id) throw notFound()

  const song = await getSongData(songId)
  if (!song) throw notFound()

  const hasRated = await hasUserRated(songId, accountId)
  const averageRating = await getAverageRating(songId)

  return { song, hasRated, averageRating }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = await requireAuthCookie(request)
  const formData = await request.formData()
  const ratingValue = parseInt(formData.get('rating') as string, 10)

  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
    return new Response('Invalid rating', { status: 400 })
  }

  const songId = String(params.id)
  await giveRating(songId, ratingValue, accountId)

  return redirect(`/song/${songId}`)
}

export default function Song() {
  const { song, hasRated, averageRating } = useLoaderData<typeof loader>()
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
          <button type='submit'>Submit Rating</button>
        </Form>
      )}
    </div>
  )
}

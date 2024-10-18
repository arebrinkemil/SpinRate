import { useLoaderData, useActionData, Form } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { notFound } from '~/http/bad-request'
import { getSongData, giveRating } from './queries'
import { requireAuthCookie } from '~/auth/auth'

export async function loader({ request, params }: LoaderFunctionArgs) {
  let accountId = await requireAuthCookie(request)

  if (!params.id) throw notFound()

  let id = String(params.id)

  let song = await getSongData(id)
  if (!song) throw notFound()

  return { song }
}

export async function action({ request, params }: ActionFunctionArgs) {
  let accountId = await requireAuthCookie(request)
  const formData = await request.formData()
  const ratingValue = parseInt(formData.get('rating') as string, 10)

  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
    return new Response('Invalid rating', { status: 400 })
  }

  const songId = String(params.id)

  giveRating(songId, ratingValue, accountId)

  return redirect(`/song/${songId}`)
}

export default function Song() {
  const { song } = useLoaderData<typeof loader>()
  const actionData = useActionData()

  return (
    <div>
      <h1>{song.name}</h1>
      <img src={song.imageUrl ?? ''} alt={song.name} />

      <Form method='post'>
        <label>
          Rate this song (1-10):
          <input type='number' name='rating' min='1' max='10' required />
        </label>
        <button type='submit'>Submit Rating</button>
      </Form>
    </div>
  )
}

import { Form } from '@remix-run/react'

interface RatingFormProps {
  targetId: string
  targetType: 'SONG' | 'ALBUM' | 'ARTIST'
  hasRated: boolean
}

export default function RatingForm({
  targetId,
  targetType,
  hasRated,
}: RatingFormProps) {
  return hasRated ? (
    <p>You have already rated this {targetType.toLowerCase()}.</p>
  ) : (
    <Form method='post'>
      <label>
        Rate this {targetType.toLowerCase()} (1-10):
        <input type='number' name='rating' min='1' max='10' required />
      </label>
      <input type='hidden' name='intent' value='rate' />
      <input type='hidden' name='type' value={targetType} />
      <button type='submit'>Submit Rating</button>
    </Form>
  )
}

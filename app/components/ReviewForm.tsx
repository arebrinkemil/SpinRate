import { Form } from '@remix-run/react'

interface ReviewFormProps {
  targetId: string
  targetType: 'SONG' | 'ALBUM' | 'ARTIST'
}

export default function ReviewForm({ targetId, targetType }: ReviewFormProps) {
  return (
    <Form method='post'>
      <label>
        Your review of this {targetType.toLowerCase()}:
        <textarea name='review' rows={3} required />
      </label>
      <input type='hidden' name='intent' value='review' />
      <input type='hidden' name='type' value={targetType} />
      <button type='submit'>Submit Review</button>
    </Form>
  )
}

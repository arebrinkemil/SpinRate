import { Form } from '@remix-run/react'
import { Slider } from '@nextui-org/react'

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
        <Slider
          size='lg'
          step={1}
          color='foreground'
          label='Rating'
          showSteps={true}
          maxValue={10}
          minValue={1}
          defaultValue={5}
          className='max-w-md'
          name='rating'
        />
      </label>
      <input type='hidden' name='intent' value='rate' />
      <input type='hidden' name='type' value={targetType} />
      <button type='submit'>Submit Rating</button>
    </Form>
  )
}

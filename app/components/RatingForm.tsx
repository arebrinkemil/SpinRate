import { Form } from '@remix-run/react'
import { Slider, Button } from '@nextui-org/react'

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
    <p className='text-platinum min-h-24 md:text-black'>
      You have already rated this {targetType.toLowerCase()}.
    </p>
  ) : (
    <Form method='post' className='w-full'>
      <label>
        <h3 className='text-platinum md:text-black'>
          Rate this {targetType.toLowerCase()}
        </h3>
        <Slider
          size='lg'
          step={1}
          color='foreground'
          showSteps={true}
          maxValue={10}
          minValue={1}
          defaultValue={5}
          className='w-full'
          name='rating'
        />
      </label>
      <input type='hidden' name='intent' value='rate' />
      <input type='hidden' name='type' value={targetType} />
      <Button className='bg-hallon w-full rounded-none' type='submit'>
        Submit Rating
      </Button>
    </Form>
  )
}

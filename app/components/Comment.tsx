import { Form } from '@remix-run/react'
import { Textarea } from '@nextui-org/input'

interface CommentFormProps {
  reviewId: string
  reviewContent: string
}

export default function CommentForm({
  reviewId,
  reviewContent,
}: CommentFormProps) {
  return (
    <>
      <div className='p-4'>
        <Form method='post'>
          <label>Comment on this review:</label>
          <Textarea
            name='comment'
            variant={'underlined'}
            placeholder='Enter your comment'
            className='col-span-12 mb-6 md:col-span-6 md:mb-0'
          />
          <input type='hidden' name='intent' value='comment' />
          <input type='hidden' name='reviewId' value={reviewId} />
          <button type='submit'>Submit</button>
        </Form>
      </div>
    </>
  )
}

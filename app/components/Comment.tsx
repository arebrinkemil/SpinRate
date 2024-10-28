import { Form } from '@remix-run/react'
import { Modal, ModalContent, Button, useDisclosure } from '@nextui-org/react'
import { Textarea } from '@nextui-org/input'

interface CommentFormProps {
  reviewId: string
  reviewContent: string
}

export default function CommentForm({
  reviewId,
  reviewContent,
}: CommentFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen}>Comment</Button>
      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent>
          {onClose => (
            <div className='p-8'>
              <Form method='post'>
                <label>Your comment on this review: {reviewContent}</label>
                <Textarea
                  name='comment'
                  variant={'underlined'}
                  placeholder='Enter your comment'
                  className='col-span-12 mb-6 md:col-span-6 md:mb-0'
                />
                <input type='hidden' name='intent' value='comment' />
                <input type='hidden' name='reviewId' value={reviewId} />
                <button type='submit'>Submit Comment</button>
              </Form>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

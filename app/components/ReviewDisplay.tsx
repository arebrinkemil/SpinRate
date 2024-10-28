import { Link, Form } from '@remix-run/react'
import CommentForm from '~/components/Comment'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react'
import CornerMarkings from './CornerMarkings'

interface ReviewDisplayProps {
  review: {
    id: string
    content: string
    user: { username: string; profileImageUrl: string | null }
    comments: Array<{
      id: string
      content: string
      user: { username: string }
    }>
  }
}

export default function ReviewDisplay({ review }: ReviewDisplayProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <li className='flex w-full flex-col'>
      <div className='flex w-full flex-row justify-between gap-4'>
        <CornerMarkings
          className='mt-4 flex w-full cursor-pointer'
          hoverEffect={true}
        >
          <div
            className='flex w-full flex-row items-center justify-between'
            onClick={onOpen}
          >
            <p>{review.content}</p>
            <div className='flex flex-col-reverse items-center'>
              <p>{review.user.username}</p>
              <img
                src={review.user.profileImageUrl ?? ''}
                alt={review.user.username}
                className='aspect-square w-10 object-cover'
              />
            </div>
          </div>
        </CornerMarkings>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={true}
          isKeyboardDismissDisabled={true}
          className='rounded-none'
        >
          <ModalContent>
            {onClose => (
              <div className='p-4'>
                <CornerMarkings
                  className='mt-4 flex flex-row items-center justify-between'
                  hoverEffect={false}
                >
                  <p>{review.content}</p>
                  <div className='flex flex-col-reverse items-center'>
                    <p>{review.user.username}</p>
                    <img
                      src={review.user.profileImageUrl ?? ''}
                      alt={review.user.username}
                      className='aspect-square w-10 object-cover'
                    />
                  </div>
                </CornerMarkings>
                <ul className='mx-4'>
                  <h3 className='text-xl underline'>Comments</h3>
                  {review.comments.map(comment => (
                    <li className='flex flex-row gap-1' key={comment.id}>
                      <p>{comment.user.username}: </p>
                      <p> {comment.content}</p>
                    </li>
                  ))}
                </ul>
                <CommentForm
                  reviewId={review.id}
                  reviewContent={review.content}
                />
              </div>
            )}
          </ModalContent>
        </Modal>
      </div>
      <ul className='mx-4'>
        <h3 className='text-xl underline'></h3>
        {review.comments.map(comment => (
          <li className='flex flex-row gap-1' key={comment.id}>
            <p>{comment.user.username}: </p>
            <p> {comment.content}</p>
          </li>
        ))}
      </ul>
    </li>
  )
}

import { Link, Form } from "@remix-run/react";
import CommentForm from "~/components/Comment";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import CornerMarkings from "./CornerMarkings";

interface ReviewDisplayProps {
  review: {
    id: string;
    content: string;
    user: { id: string; username: string; profileImageUrl: string | null };
    comments: Array<{
      id: string;
      content: string;
      user: { id: string; username: string };
    }>;
  };
}

export default function ReviewDisplay({ review }: ReviewDisplayProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <li className="flex min-h-20 w-full flex-col">
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="mt-4 flex w-full cursor-pointer flex-row items-center justify-between border-2 border-b-4 border-black dark:border-silver p-2">
          <div
            className="flex w-full flex-row items-center justify-between"
            onClick={onOpen}
          >
            <p>{review.content}</p>
            <div className="flex flex-col-reverse items-center">
              <Link to={`/profile/${review.user.id}`}>
                {review.user.username}
              </Link>
              <img
                src={review.user.profileImageUrl ?? ""}
                alt={review.user.username}
                className="aspect-square w-10 object-cover"
              />
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={true}
          isKeyboardDismissDisabled={true}
          className="bg-lightsilver dark:bg-darkgray  rounded-none"
        >
          <ModalContent>
            {(onClose) => (
              <div className="p-4 ">
                <div className="mt-4 flex flex-row items-center justify-between border-2 border-b-4 border-black dark:border-silver  p-2">
                  <p>{review.content}</p>
                  <div className="flex flex-col-reverse items-center">
                    <Link to={`/profile/${review.user.id}`}>
                      {review.user.username}
                    </Link>
                    <img
                      src={review.user.profileImageUrl ?? ""}
                      alt={review.user.username}
                      className="aspect-square w-10 object-cover"
                    />
                  </div>
                </div>
                <ul className="mx-4">
                  <h3 className="text-xl underline">Comments</h3>
                  {review.comments.map((comment) => (
                    <li className="flex flex-row gap-1" key={comment.id}>
                      <Link to={`/profile/${comment.user.id}`}>
                        {comment.user.username}
                      </Link>
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
      <ul className="mx-4">
        <h3 className="text-xl underline"></h3>
        {review.comments.map((comment) => (
          <li className="flex flex-row gap-1" key={comment.id}>
            <Link className="font-bold" to={`/profile/${comment.user.id}`}>
              {comment.user.username}:
            </Link>
            <p> {comment.content}</p>
          </li>
        ))}
      </ul>
    </li>
  );
}

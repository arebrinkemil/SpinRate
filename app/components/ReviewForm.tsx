import { Form } from "@remix-run/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";

interface ReviewFormProps {
  targetId: string;
  targetType: "SONG" | "ALBUM" | "ARTIST";
}

export default function ReviewForm({ targetId, targetType }: ReviewFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  let buttonClass = "bg-lightsilver dark:bg-darkgray ";
  switch (targetType) {
    case "ARTIST":
      buttonClass = "bg-orange";
      break;
    case "ALBUM":
      buttonClass = "bg-blue";
      break;
    case "SONG":
      buttonClass = "bg-hallon";
      break;
    default:
      break;
  }

  return (
    <>
      <Button className={`${buttonClass} w-full rounded-none`} onPress={onOpen}>
        REVIEW
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-10",
        }}
        className="bg-lightsilver dark:bg-darkgray  rounded-none"
      >
        <ModalContent>
          {(onClose) => (
            <div className="">
              <div className="p-8">
                <Form method="post">
                  <label>
                    Your review of this {targetType.toLowerCase()}:
                    <Textarea
                      name="review"
                      variant={"underlined"}
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter your review"
                      className="col-span-12 mb-6 md:col-span-6 md:mb-0"
                    />
                  </label>
                  <input type="hidden" name="intent" value="review" />
                  <input type="hidden" name="type" value={targetType} />
                  <button type="submit">Submit Review</button>
                </Form>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

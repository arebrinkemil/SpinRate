import { Form } from "@remix-run/react";
import { Slider, Button } from "@nextui-org/react";

interface RatingFormProps {
  targetId: string;
  targetType: "SONG" | "ALBUM" | "ARTIST";
  hasRated: boolean;
}

export default function RatingForm({
  targetId,
  targetType,
  hasRated,
}: RatingFormProps) {
  return hasRated ? (
    <p className="text-platinum min-h-24 md:text-black dark:text-silver">
      You have already rated this {targetType.toLowerCase()}.
    </p>
  ) : (
    <Form method="post" className="flex w-full flex-col">
      <h4 className="text-platinum md:text-black dark:text-silver">
        Rate this {targetType.toLowerCase()}
      </h4>
      <label>
        <Slider
          size="lg"
          step={1}
          color="foreground"
          showSteps={true}
          maxValue={10}
          minValue={1}
          defaultValue={5}
          radius="none"
          className="w-full rounded-none"
          classNames={{
            base: "w-full rounded-none",
            track: "rounded-none",
            thumb: "rounded-none",
            step: "rounded-none",
          }}
          name="rating"
        />
      </label>
      <input type="hidden" name="intent" value="rate" />
      <input type="hidden" name="type" value={targetType} />
      <Button className="bg-hallon w-full rounded-none" type="submit">
        Submit Rating
      </Button>
    </Form>
  );
}

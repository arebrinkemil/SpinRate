import { twMerge } from "tailwind-merge";

export default function AverageRating({
  type = "",
  averageRating = null,
  className = "",
}: {
  type: string;
  averageRating: number | null;
  className?: string;
}) {
  const mergedClasses = twMerge(
    "flex flex-col items-center h-full w-full",
    className
  );

  const maxValue = 10;
  const ratingPercentage =
    averageRating !== null ? averageRating / maxValue : 0;

  const getColor = () => {
    if (averageRating !== null && averageRating >= 8) return "#079a09";
    if (averageRating !== null && averageRating >= 6) return "#7de079";
    if (averageRating !== null && averageRating >= 4) return "#f7e12e";
    if (averageRating !== null && averageRating >= 2) return "#f7a82e";

    return "#f44"; // Red
  };

  return (
    <div className={twMerge(mergedClasses)}>
      <div className={"relative h-full w-1/2 overflow-hidden"}>
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            backgroundColor: getColor(),
            height: `${ratingPercentage * 100}%`,
          }}
        ></div>
      </div>
      <p className="mt-1 font-bold text-center text-white">
        {averageRating !== null ? averageRating.toFixed(1) : "-"}
      </p>
    </div>
  );
}

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

  return (
    <div className={twMerge(mergedClasses)}>
      <div className="relative h-full w-1/2 overflow-hidden border-t-1 border-b-1 border-black dark:border-silver">
        <div
          className={twMerge(
            "absolute bottom-0 left-0 w-full",
            averageRating !== null && averageRating >= 9.5
              ? "bg-yellow-500 dark:bg-yellow-400"
              : averageRating !== null && averageRating < 2
              ? "bg-red-500 dark:bg-red-400"
              : "bg-black dark:bg-silver"
          )}
          style={{
            height: `${ratingPercentage * 100}%`,
          }}
        ></div>
      </div>
      <p className="mt-1 font-bold text-center text-black dark:text-white">
        {averageRating !== null ? averageRating.toFixed(0) : "-"}
      </p>
    </div>
  );
}

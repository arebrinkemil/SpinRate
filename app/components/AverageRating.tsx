import { twMerge } from 'tailwind-merge'

export default function AverageRating({
  averageRating,
  className = '',
}: {
  averageRating: number | null
  className?: string
}) {
  const mergedClasses = twMerge('text-2xl', className)
  return (
    <div className={mergedClasses}>
      <h3>{averageRating !== null ? averageRating.toFixed(1) : '-'}</h3>
    </div>
  )
}

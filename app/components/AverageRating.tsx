export default function AverageRating({
  averageRating,
}: {
  averageRating: number | null
}) {
  return (
    <div>
      <h3>{averageRating !== null ? averageRating.toFixed(1) : '-'}</h3>
    </div>
  )
}

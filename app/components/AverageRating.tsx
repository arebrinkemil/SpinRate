export default function AverageRating({
  averageRating,
}: {
  averageRating: number | null
}) {
  return (
    <div>
      <h3>{averageRating !== null ? averageRating : '-'}</h3>
    </div>
  )
}

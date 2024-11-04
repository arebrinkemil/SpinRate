import { twMerge } from 'tailwind-merge'

export default function AverageRating({
  type = '',
  averageRating = null,
  className = '',
}: {
  type: string
  averageRating: number | null
  className?: string
}) {
  const mergedClasses = twMerge(
    'text-2xl flex flex-col items-center',
    className,
  )

  const maxValue = 10
  const ratingPercentage = averageRating !== null ? averageRating / maxValue : 0
  const angle = ratingPercentage * 180

  const radius = 50
  const circumference = Math.PI * radius
  const strokeDasharray = `${(angle / 180) * circumference} ${circumference}`

  const getColor = () => {
    if (type == 'VERIFIED') return '#79B473' //kanske är jätteful färg, tillsviadre
    if (type == 'PUBLIC') return '#F4442E'
    return '#F44336'
  }

  return (
    <div className={mergedClasses}>
      <div className='w-full max-w-[200px]'>
        <svg className='aspect-square h-auto w-full' viewBox='0 0 120 60'>
          <path
            d='M 10 50 A 40 40 0 0 1 110 50'
            fill='none'
            stroke='#E9E9E6'
            strokeWidth='10'
          />
          <path
            d='M 10 50 A 40 40 0 0 1 110 50'
            fill='none'
            stroke={getColor()}
            strokeWidth='10'
            strokeDasharray={strokeDasharray}
          />
          <text
            x='60'
            y='50'
            textAnchor='middle'
            alignmentBaseline='middle'
            fontSize='20'
            fill='#121212'
            fontWeight='bold'
          >
            {averageRating !== null ? averageRating.toFixed(1) : '-'}
          </text>
        </svg>
      </div>
    </div>
  )
}

import { twMerge } from 'tailwind-merge'

export default function AverageRating({
  averageRating,
  className = '',
}: {
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
            stroke='#CE2D4F'
            strokeWidth='10'
            strokeDasharray={strokeDasharray}
          />
        </svg>
      </div>
      <h3 className='-mt-8 lg:text-2xl xl:text-xl'>
        {averageRating !== null ? averageRating.toFixed(1) : '-'}
      </h3>

    </div>
  )
}
// transparent: 'transparent',
// current: 'currentColor',
// black: '#121212',
// gray: '#857885',
// silver: '#B3B2AE',
// lightsilver: '#C1C1BA',
// platinum: '#E9E9E6',
// blue: '#1F7A8C',
// hallon: '#CE2D4F',

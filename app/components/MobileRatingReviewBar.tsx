import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import RatingForm from '~/components/RatingForm'
import ReviewForm from '~/components/ReviewForm'

type MobileRatingReviewBarProps = {
  targetId: string
  targetType: 'SONG' | 'ALBUM' | 'ARTIST'
  hasRated: boolean
  verified: boolean
}

export default function MobileRatingReviewBar({
  targetId,
  targetType,
  hasRated,
  verified,
}: MobileRatingReviewBarProps) {
  return (
    <motion.div
      className='fixed bottom-0 left-0 right-0  bg-black p-4 md:hidden'
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'tween', stiffness: 100 }}
    >
      <div className='flex items-center justify-between gap-4'>
        <div className='basis-3/5'>
          <RatingForm
            targetId={targetId}
            targetType={targetType}
            hasRated={hasRated}
          />
        </div>
        <div className='basis-2/5'>
          <h3 className='text-platinum mb-10 md:text-black'>Leave a review</h3>
          {verified ? (
            <ReviewForm targetId={targetId} targetType={targetType} />
          ) : (
            <p className='text-sm text-gray-400'>
              <Link to='/login' className='underline'>
                Login
              </Link>{' '}
              to leave a review.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

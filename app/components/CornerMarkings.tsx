import React from 'react'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

interface CornerMarkingsProps {
  children: React.ReactNode
  hoverEffect?: boolean
  className?: string
}

const CornerMarkings: React.FC<CornerMarkingsProps> = ({
  children,
  hoverEffect = true,
  className = '',
}) => {
  const mergedClasses = twMerge('relative p-4', className)

  return (
    <>
      {hoverEffect ? (
        <motion.div
          className={mergedClasses}
          initial={{ padding: '0.5rem' }}
          whileHover={{ padding: '0rem' }}
          transition={{ duration: 0.3 }}
        >
          <div className='pointer-events-none absolute inset-0'>
            <span className='corner-mark top-left'></span>
            <span className='corner-mark top-right'></span>
            <span className='corner-mark bottom-left'></span>
            <span className='corner-mark bottom-right'></span>
          </div>
          {children}
        </motion.div>
      ) : (
        <motion.div className={mergedClasses}>
          <div className='pointer-events-none absolute inset-0'>
            <span className='corner-mark top-left'></span>
            <span className='corner-mark top-right'></span>
            <span className='corner-mark bottom-left'></span>
            <span className='corner-mark bottom-right'></span>
          </div>
          {children}
        </motion.div>
      )}
    </>
  )
}

export default CornerMarkings

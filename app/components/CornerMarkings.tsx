import React from 'react'
import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

interface CornerMarkingsProps {
  children: React.ReactNode
  hoverEffect?: boolean
  className?: string
  mediaType?: 'ARTIST' | 'ALBUM' | 'SONG' | 'DEFAULT'
}

const CornerMarkings: React.FC<CornerMarkingsProps> = ({
  children,
  hoverEffect = true,
  className = '',
  mediaType,
}) => {
  const mergedClasses = twMerge('relative p-4', className)

  let cornerMarkClass = ''
  switch (mediaType?.toUpperCase()) {
    case 'ARTIST':
      cornerMarkClass = 'corner-mark-artist'
      break
    case 'ALBUM':
      cornerMarkClass = 'corner-mark-album'
      break
    case 'SONG':
      cornerMarkClass = 'corner-mark-single'
      break
    case 'DEFAULT':
      cornerMarkClass = 'corner-mark'
      break
    default:
      break
  }

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
            <span className={`top-left ${cornerMarkClass}`}></span>
            <span className={`bottom-right ${cornerMarkClass}`}></span>
          </div>
          {children}
        </motion.div>
      ) : (
        <motion.div className={mergedClasses}>
          <div className='pointer-events-none absolute inset-0'>
            <span className={`top-left ${cornerMarkClass}`}></span>
            <span className={`bottom-right ${cornerMarkClass}`}></span>
          </div>
          {children}
        </motion.div>
      )}
    </>
  )
}

export default CornerMarkings

import { motion } from 'framer-motion'

export default function Projects() {
  return (
    <div className='h-full'>
      <h1>HELLO HOME</h1>
      <motion.div
        className='h-9 w-10 bg-blue-500'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      />
    </div>
  )
}

import { forwardRef } from 'react'

export let Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className='bg-blue focus-visible:outline-brand-blue flex w-full justify-center px-1 py-1 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
    />
  )
})

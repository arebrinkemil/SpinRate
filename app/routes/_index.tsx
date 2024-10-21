import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Trellix, a Remix Demo' }]
}

export default function Index() {
  return (
    <div className='flex h-full flex-col items-center bg-slate-900 pt-20'>
      <img src='/remix-logo-new@dark.png' width='402' height='149' />
      <div className='max-w-md space-y-4 text-lg text-slate-300'></div>
      <div className='mt-8 flex w-full max-w-md justify-evenly rounded-3xl bg-slate-800 p-10'>
        <Link
          to='/signup'
          className='text-brand-aqua text-xl font-medium underline'
        >
          Sign up
        </Link>
        <div className='border-gray h-full border-r' />
        <Link
          to='/login'
          className='text-brand-aqua text-xl font-medium underline'
        >
          Login
        </Link>
      </div>
    </div>
  )
}

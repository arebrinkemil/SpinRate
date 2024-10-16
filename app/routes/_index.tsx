import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [{ title: 'Trellix, a Remix Demo' }]
}

export default function Index() {
  return (
    <div className='flex h-full flex-col items-center bg-slate-900 pt-20'>
      <img src='/remix-logo-new@dark.png' width='402' height='149' />
      <div className='max-w-md space-y-4 text-lg text-slate-300'>
        <p>
          This is a demo app to show off the features of Remix and teach them
          through some videos we've published on{' '}
          <a
            href='https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB'
            className='underline'
          >
            YouTube
          </a>
          .
        </p>
        <p>
          It's a recreation of the popular drag and drop interface in{' '}
          <a href='https://trello.com' className='underline'>
            Trello
          </a>{' '}
          and other similar apps.
        </p>
        <p>If you want to play around, click sign up!</p>
      </div>
      <div className='mt-8 flex w-full max-w-md justify-evenly rounded-3xl bg-slate-800 p-10'>
        <Link
          to='/signup'
          className='text-brand-aqua text-xl font-medium underline'
        >
          Sign up
        </Link>
        <div className='h-full border-r border-slate-500' />
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

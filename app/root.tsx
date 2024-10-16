import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
  Link,
} from '@remix-run/react'
import { redirect, type DataFunctionArgs } from '@remix-run/node'

import { LoginIcon, LogoutIcon } from './icons/icons'
import { getAuthFromRequest } from './auth/auth'

import './tailwind.css'

export async function loader({ request }: DataFunctionArgs) {
  let auth = await getAuthFromRequest(request)
  if (auth && new URL(request.url).pathname === '/') {
    throw redirect('/home')
  }
  return auth
}

export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
  return formAction && ['/login', '/signup', 'logout'].includes(formAction)
}

export default function App() {
  let userId = useLoaderData<typeof loader>()

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <Meta />
        <Links />
      </head>
      <body className='h-screen bg-slate-100 text-slate-900'>
        <div className='flex h-full min-h-0 flex-col'>
          <div className='box-border flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4'>
            <Link to='/' className='block w-1/3 leading-3'>
              <div className='text-2xl font-black text-white'>Trellix</div>
              <div className='text-slate-500'>a Remix Demo</div>
            </Link>
            <div className='flex items-center gap-6'>
              <IconLink
                href='https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB'
                icon='/yt_icon_mono_dark.png'
                label='Videos'
              />
              <IconLink
                href='https://github.com/remix-run/example-trellix'
                label='Source'
                icon='/github-mark-white.png'
              />
              <IconLink
                href='https://remix.run/docs/en/main'
                icon='/r.png'
                label='Docs'
              />
            </div>
            <div className='flex w-1/3 justify-end'>
              {userId ? (
                <form method='post' action='/logout'>
                  <button className='block text-center'>
                    <LogoutIcon />
                    <br />
                    <span className='text-xs font-bold uppercase text-slate-500'>
                      Log out
                    </span>
                  </button>
                </form>
              ) : (
                <Link to='/login' className='block text-center'>
                  <LoginIcon />
                  <br />
                  <span className='text-xs font-bold uppercase text-slate-500'>
                    Log in
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className='h-full min-h-0 flex-grow'>
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function IconLink({
  icon,
  href,
  label,
}: {
  icon: string
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      className='text-center text-xs font-bold uppercase text-slate-500'
    >
      <img src={icon} aria-hidden className='inline-block h-8' />
      <span className='mt-2 block'>{label}</span>
    </a>
  )
}

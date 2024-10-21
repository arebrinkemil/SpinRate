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
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
      </head>
      <body className='bg-platinum h-screen text-black'>
        <div className='flex h-full min-h-0 flex-col'>
          <div className='box-border flex items-center justify-between bg-black px-8 py-4'>
            <Link to='/' className='block w-1/3 leading-3'>
              <div className='text-platinum text-4xl font-black'>SpinRate</div>
              <div className='text-gray'>Rate music</div>
            </Link>
            <div className='flex items-center gap-6'></div>
            <div className='flex w-1/3 justify-end'>
              {userId ? (
                <form method='post' action='/logout'>
                  <button className='block text-center'>
                    <LogoutIcon />
                    <br />
                    <span className='text-gray text-xs font-bold uppercase'>
                      Log out
                    </span>
                  </button>
                </form>
              ) : (
                <Link to='/login' className='block text-center'>
                  <LoginIcon />
                  <br />
                  <span className='text-gray text-xs font-bold uppercase'>
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
      className='text-gray text-center text-xs font-bold uppercase'
    >
      <img src={icon} aria-hidden className='inline-block h-8' />
      <span className='mt-2 block'>{label}</span>
    </a>
  )
}

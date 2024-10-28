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

import { getAuthFromRequest } from './auth/auth'
import { NavBar } from './components/NavBar'
import './tailwind.css'
import { NextUIProvider } from '@nextui-org/react'

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
      <body className='bg-silver  text-black'>
        <NextUIProvider>
          <div className='flex h-full min-h-0 flex-col'>
            <NavBar userId={userId} />

            <div className='h-full min-h-0 flex-grow'>
              <Outlet />
            </div>
          </div>

          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
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

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'SPINRATE' }]
}

export const loader: LoaderFunction = async () => {
  return redirect('/home')
}

export default function Index() {
  return null
}

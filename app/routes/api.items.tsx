import { json } from '@remix-run/node'
import { getItems, createItem } from '~/utils/db.server'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'

// Loader to handle GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  const items = await getItems()
  return json(items)
}

// Action to handle POST requests
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get('name')?.toString()

  if (!name) {
    return json({ error: 'Name is required' }, { status: 400 })
  }

  const item = await createItem(name)
  return json(item, { status: 201 })
}

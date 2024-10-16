// app/components/Items.tsx
import { Form } from '@remix-run/react'

type Item = {
  id: number
  name: string
}

interface ItemsProps {
  items: Item[]
}

export function Items({ items }: ItemsProps) {
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <h2>Add a new item</h2>
      <Form method='post' action='/api/items'>
        <label>
          Name:
          <input type='text' name='name' />
        </label>
        <button type='submit'>Add Item</button>
      </Form>
    </div>
  )
}

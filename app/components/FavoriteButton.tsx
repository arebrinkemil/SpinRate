import { Form } from '@remix-run/react'
import { IoMusicalNotesOutline, IoMusicalNotes } from 'react-icons/io5'
import { Tooltip } from '@nextui-org/tooltip'

type FavoriteButtonProps = {
  targetId: string
  targetType: 'SONG' | 'ALBUM' | 'ARTIST'
  isFavorite: boolean
  verified: boolean
}

export default function FavoriteButton({
  targetId,
  targetType,
  isFavorite,
  verified,
}: FavoriteButtonProps) {
  if (!verified) {
    return (
      <p>
        Please <a href='/login'>login</a> to favorite this item.
      </p>
    )
  }

  return (
    <Form method='post'>
      <input
        type='hidden'
        name='intent'
        value={isFavorite ? 'unfavorite' : 'favorite'}
      />
      <input type='hidden' name='targetId' value={targetId} />
      <input type='hidden' name='targetType' value={targetType} />
      <Tooltip content='Favorite' placement='right' radius='none'>
        <button type='submit' className='btn'>
          {isFavorite ? (
            <IoMusicalNotes color='yellow' size={40} />
          ) : (
            <IoMusicalNotesOutline size={40} />
          )}
        </button>
      </Tooltip>
    </Form>
  )
}

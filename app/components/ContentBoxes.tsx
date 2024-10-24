import React from 'react'
import { Album, Song } from '@prisma/client'
import AverageRating from './AverageRating'
import CornerMarkings from './CornerMarkings'
import { Link } from '@remix-run/react'
import { truncateText } from '~/utils/truncate'

interface AlbumBoxProps {
  album: Album & { averageRating: number; artistName: string }
}

interface SongBoxProps {
  song: Song & { averageRating: number; artistName: string }
}

export function AlbumBox({ album }: AlbumBoxProps) {
  return (
    <Link to={`/album/${album.id}`} key={album.id}>
      <CornerMarkings className='aspect-square' hoverEffect={true}>
        <li className='bg-lightsilver flex h-full w-full flex-col p-4'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={album.imageUrl ?? ''}
              alt={album.name}
              className='h-full w-4/6 object-cover'
            />
            <AverageRating
              className='flex h-full w-2/6 items-center justify-center text-white'
              averageRating={album.averageRating}
            />
          </div>
          <h1 className='text-platinum text-xl'>
            {' '}
            {truncateText(album.name, 24)}
          </h1>
          <p className='text-lg text-white'>{album.artistName}</p>
        </li>
      </CornerMarkings>
    </Link>
  )
}

export function SongBox({ song }: SongBoxProps) {
  return (
    <Link to={`/song/${song.id}`} key={song.id}>
      <CornerMarkings className='aspect-square' hoverEffect={true}>
        <li className='bg-lightsilver flex h-full w-full flex-col p-4'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={song.imageUrl ?? ''}
              alt={song.name}
              className='h-full w-4/6 object-cover'
            />
            <AverageRating
              className='flex h-full w-2/6 items-center justify-center text-white'
              averageRating={song.averageRating}
            />
          </div>
          <h1 className='text-platinum text-xl'>{song.name}</h1>

          <p className='text-lg text-white'>{song.artistName}</p>
        </li>
      </CornerMarkings>
    </Link>
  )
}

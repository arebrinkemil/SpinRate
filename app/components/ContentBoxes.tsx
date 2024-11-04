import React from 'react'
import { Album, Song, Artist } from '@prisma/client'
import AverageRating from './AverageRating'
import CornerMarkings from './CornerMarkings'
import { Link } from '@remix-run/react'
import { truncateText } from '~/utils/truncate'

interface AlbumBoxProps {
  album: Album & { averageRating: number; artist: { name: string } }
}

interface SongBoxProps {
  song: Song & { averageRating: number; artist: { name: string } }
}

interface ArtistBoxProps {
  artist: Artist & { averageRating: number }
}

export function AlbumBox({
  album,
  className,
}: AlbumBoxProps & { className?: string }) {
  return (
    <Link to={`/album/${album.id}`} key={album.id} className={className}>
      <CornerMarkings
        mediaType='ALBUM'
        className='aspect-square'
        hoverEffect={true}
      >
        <li className='bg-lightsilver flex h-full w-full flex-col p-4 pr-0'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={album.imageUrl ?? ''}
              alt={album.name}
              className='h-full w-4/6 object-cover'
            />
            <div className='flex h-full w-2/6 flex-col items-center justify-center'>
              <AverageRating
                className=' text-white'
                averageRating={album.averageRating}
              />
              <AverageRating
                className=' text-white'
                averageRating={album.averageRating}
              />
            </div>
          </div>
          <h1 className='text-platinum text-xl'>
            {' '}
            {truncateText(album.name, 24)}
          </h1>
          <p className='text-lg text-white'>{album.artist.name}</p>
        </li>
      </CornerMarkings>
    </Link>
  )
}

export function SongBox({ song }: SongBoxProps) {
  return (
    <Link to={`/song/${song.id}`} key={song.id}>
      <CornerMarkings
        mediaType='SONG'
        className='aspect-square'
        hoverEffect={true}
      >
        <li className='bg-lightsilver flex h-full w-full flex-col p-4 pr-0'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={song.imageUrl ?? ''}
              alt={song.name}
              className='h-full w-4/6 object-cover'
            />
            <div className='flex h-full w-2/6 flex-col items-center justify-center'>
              <AverageRating
                className=' text-white'
                averageRating={song.averageRating}
              />
              <AverageRating
                className=' text-white'
                averageRating={song.averageRating}
              />
            </div>
          </div>
          <h1 className='text-platinum text-xl'>{song.name}</h1>

          <p className='text-lg text-white'>{song.artist.name}</p>
        </li>
      </CornerMarkings>
    </Link>
  )
}

export function ArtistBox({ artist }: ArtistBoxProps) {
  return (
    <Link to={`/artist/${artist.id}`} key={artist.id}>
      <CornerMarkings
        mediaType='ARTIST'
        className='aspect-square'
        hoverEffect={true}
      >
        <li className='bg-lightsilver flex h-full w-full flex-col p-4 pr-0'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={artist.imageUrl ?? ''}
              alt={artist.name}
              className='h-full w-4/6 object-cover'
            />
            <div className='flex h-full w-2/6 flex-col items-center justify-center'>
              <AverageRating
                className=' text-white'
                averageRating={artist.averageRating}
              />
              <AverageRating
                className=' text-white'
                averageRating={artist.averageRating}
              />
            </div>
          </div>
          <h1 className='text-platinum text-xl'>{artist.name}</h1>
        </li>
      </CornerMarkings>
    </Link>
  )
}

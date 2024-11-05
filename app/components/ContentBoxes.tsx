import React from 'react'
import { Album, Song, Artist } from '@prisma/client'
import AverageRating from './AverageRating'
import CornerMarkings from './CornerMarkings'
import { Link } from '@remix-run/react'
import { truncateText } from '~/utils/truncate'

interface AlbumBoxProps {
  album: Album & {
    verifiedAverage: number
    unverifiedAverage: number
    artist: { name: string }
  }
}

interface SongBoxProps {
  song: Song & {
    verifiedAverage: number
    unverifiedAverage: number
    artist: { name: string }
  }
}

interface ArtistBoxProps {
  artist: Artist & { verifiedAverage: number; unverifiedAverage: number }
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
                type='VERIFIED'
                className=' text-white'
                averageRating={album.verifiedAverage}
              />
              <AverageRating
                type='PUBLIC'
                className=' text-white'
                averageRating={album.unverifiedAverage}
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
                type='VERIFIED'
                className=' text-white'
                averageRating={song.verifiedAverage}
              />
              <AverageRating
                type='PUBLIC'
                className=' text-white'
                averageRating={song.unverifiedAverage}
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
                type='VERIFIED'
                className=' text-white'
                averageRating={artist.verifiedAverage}
              />
              <AverageRating
                type='PUBLIC'
                className=' text-white'
                averageRating={artist.unverifiedAverage}
              />
            </div>
          </div>
          <h1 className='text-platinum text-xl'>{artist.name}</h1>
        </li>
      </CornerMarkings>
    </Link>
  )
}
export function HighlightBox({ item }: { item: any }) {
  return (
    <div className='col-span-2 row-span-1 bg-black lg:col-span-3 lg:row-span-1  2xl:col-span-4 2xl:row-span-2'>
      <div className=' flex h-full flex-col p-4'>
        <h2 className='text-2xl font-bold text-white'>{item.header}</h2>
        <p className='text-white'>{item.bodyText}</p>
        <div className='flex h-full flex-col justify-center'>
          <div className='flex flex-row space-x-4'>
            {item.highlightIDs.map((highlight: any) => (
              <Link key={highlight.id} to={highlight.url ?? '#'}>
                <img
                  src={highlight.imageUrl}
                  alt={highlight.name}
                  className='aspect-square'
                />
                <p className='text-white underline'>{highlight.name}</p>
                {highlight.artist ? (
                  <p className='text-white'>{highlight.artist.name}</p>
                ) : (
                  <p className='text-white'>{highlight.artistName}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

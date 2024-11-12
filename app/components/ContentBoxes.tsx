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
        <li className='bg-lightsilver flex h-full w-full flex-col p-2 pr-0 lg:p-4'>
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
          <div className='hidden lg:block'>
            {album.name.length > 15 ? (
              <h1 className='group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black'>
                <span className='group-hover:animate-marquee block'>
                  {album.name}
                </span>
              </h1>
            ) : (
              <h1 className='mr-4 text-xl text-black'>{album.name}</h1>
            )}

            {album.artist.name.length > 15 ? (
              <p className='group relative  mr-4 overflow-hidden whitespace-nowrap text-base text-black md:text-lg'>
                <span className='group-hover:animate-marquee block'>
                  {album.artist.name}
                </span>
              </p>
            ) : (
              <p className='mr-4 text-base text-black md:text-lg'>
                {album.artist.name}
              </p>
            )}
          </div>
          <div className='block lg:hidden'>
            <h1 className='text-base leading-none md:text-lg'>
              {truncateText(album.name, 24)}
            </h1>
            <p className='text-base leading-none text-black md:text-lg'>
              {truncateText(album.artist.name, 12)}
            </p>
          </div>
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
        <li className='bg-lightsilver flex h-full w-full flex-col p-2 pr-0 lg:p-4'>
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
          <div className='hidden lg:block'>
            {song.name.length > 15 ? (
              <h1 className='group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black md:text-lg'>
                <span className='group-hover:animate-marquee block'>
                  {song.name}
                </span>
              </h1>
            ) : (
              <h1 className='mr-4 text-base md:text-lg'>{song.name}</h1>
            )}

            {song.artist.name.length > 15 ? (
              <p className='group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black md:text-lg'>
                <span className='group-hover:animate-marquee block'>
                  {song.artist.name}
                </span>
              </p>
            ) : (
              <p className='mr-4 text-base text-black md:text-lg'>
                {song.artist.name}
              </p>
            )}
          </div>
          <div className='block lg:hidden'>
            <h1 className='text-base leading-none md:text-lg'>
              {truncateText(song.name, 20)}
            </h1>
            <p className='text-base leading-none text-black md:text-lg'>
              {truncateText(song.artist.name, 12)}
            </p>
          </div>
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
        <li className='bg-lightsilver flex h-full w-full flex-col p-2 pr-0 lg:p-4'>
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
          <div className='hidden lg:hidden'>
            {artist.name.length > 15 ? (
              <h1 className='group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black'>
                <span className='group-hover:animate-marquee block'>
                  {artist.name}
                </span>
              </h1>
            ) : (
              <h1 className='mr-4 text-xl text-black'>{artist.name}</h1>
            )}
          </div>
          <div className='hidden lg:block'>
            {artist.name.length > 15 ? (
              <h1 className='group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black'>
                <span className='group-hover:animate-marquee block'>
                  {artist.name}
                </span>
              </h1>
            ) : (
              <h1 className='mr-4 text-xl text-black'>{artist.name}</h1>
            )}
          </div>
          <div className='block lg:hidden'>
            <h1 className='text-xl text-black'>{artist.name}</h1>
          </div>
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

export function RatingBox({
  rating,
  type,
}: {
  rating: any
  type: 'ALBUM' | 'SONG' | 'ARTIST'
}) {
  return (
    <Link to={`/${type}/${rating.data.id}`}>
      <CornerMarkings
        mediaType={rating.type}
        className='aspect-square'
        hoverEffect={true}
      >
        <li className='bg-lightsilver flex h-full w-full flex-col p-4 pr-0'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={rating.data.imageUrl ?? ''}
              alt={rating.data.name}
              className='h-full w-4/6 object-cover'
            />
            <div className='flex h-full w-2/6 flex-col items-center justify-center'>
              <AverageRating
                type='VERIFIED'
                className=' text-white'
                averageRating={rating.ratingValue}
              />
            </div>
          </div>
          <h1 className='text-platinum text-xl'>{rating.data.name}</h1>
        </li>
      </CornerMarkings>
    </Link>
  )
}

export function ReviewBox({
  review,
  type,
}: {
  review: any
  type: 'ALBUM' | 'SONG' | 'ARTIST'
}) {
  return (
    <Link
      to={`/${type}/${review.data.id}`}
      className='col-span-1 row-span-1 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2'
    >
      <CornerMarkings
        mediaType={review.type}
        className='aspect-square'
        hoverEffect={true}
      >
        <li className='bg-lightsilver flex h-full w-full flex-col p-4 pr-0'>
          <div className='flex h-4/6 w-full flex-row'>
            <img
              src={review.data.imageUrl ?? ''}
              alt={review.data.name}
              className='h-full w-4/6 object-cover'
            />
            <div className='flex h-full w-2/6 flex-col items-center justify-center'></div>
          </div>
          <h1 className='text-platinum text-xl'>
            {' '}
            {truncateText(review.data.name, 24)}
          </h1>
          <div className=' mr-4 flex cursor-pointer flex-row items-center justify-between border-2 border-b-4 border-black p-2'>
            <h2 className='text-platinum text-lg'>{review.reviewValue}</h2>
          </div>
        </li>
      </CornerMarkings>
    </Link>
  )
}

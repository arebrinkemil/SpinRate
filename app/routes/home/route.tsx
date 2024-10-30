import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
import { useState } from 'react'
import { requireAuthCookie } from '~/auth/auth'
import { getAlbums, getSingleSongs, getArtists } from './queries'
import { truncateText } from '~/utils/truncate'

import { getAverageRating } from '~/utils/ratingLogic'
import { AlbumBox, SongBox, ArtistBox } from '~/components/ContentBoxes'

export const meta: MetaFunction = () => {
  return [{ title: 'SPINRATE' }]
}

type LoaderData = {
  albums: any[]
  songs: any[]
  artists: any[]
  data: any[]
}

function shuffleArray<T>(array: T[] = []): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthCookie(request)

  const albums = await getAlbums()
  const songs = await getSingleSongs()
  const artists = await getArtists()

  const albumsWithRatings = await Promise.all(
    albums.map(async album => {
      const averageRating = await getAverageRating(album.id, 'ALBUM')
      if (averageRating !== null && averageRating !== undefined) {
        return { ...album, averageRating, type: 'album' }
      }
      return null
    }),
  ).then(results => results.filter(album => album !== null))

  const songsWithRatings = await Promise.all(
    songs.map(async song => {
      const averageRating = await getAverageRating(song.id, 'SONG')
      if (averageRating !== null && averageRating !== undefined) {
        return { ...song, averageRating, type: 'song' }
      }
      return null
    }),
  ).then(results => results.filter(song => song !== null))

  const artistsWithRatings = await Promise.all(
    artists.map(async artist => {
      const averageRating = await getAverageRating(artist.id, 'ARTIST')
      if (averageRating !== null && averageRating !== undefined) {
        return { ...artist, averageRating, type: 'artist' }
      }
      return null
    }),
  ).then(results => results.filter(artist => artist !== null))

  const combinedData = shuffleArray([
    ...albumsWithRatings,
    ...songsWithRatings,
    ...artistsWithRatings,
  ])

  return json<LoaderData>({
    albums: albumsWithRatings,
    songs: songsWithRatings,
    artists: artistsWithRatings,
    data: combinedData,
  })
}

export default function Home() {
  const { data } = useLoaderData<LoaderData>()

  const [filter, setFilter] = useState<'all' | 'album' | 'song' | 'artist'>(
    'all',
  )

  const filteredData = data.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  return (
    <div className='px-10'>
      <div className='mb-4 flex space-x-4'>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 underline decoration-black decoration-4 ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('album')}
          className={`decoration-hallon px-4 py-2 underline decoration-4 ${filter === 'album' ? 'text-hallon bg-gray-800' : 'bg-gray-200'}`}
        >
          Albums
        </button>
        <button
          onClick={() => setFilter('song')}
          className={`decoration-blue px-4 py-2 underline decoration-4 ${filter === 'song' ? 'text-blue bg-gray-800' : 'bg-gray-200'}`}
        >
          Songs
        </button>
        <button
          onClick={() => setFilter('artist')}
          className={`decoration-orange px-4 py-2 underline decoration-4 ${filter === 'artist' ? 'text-orange bg-gray-800' : 'bg-gray-200'}`}
        >
          Artists
        </button>
      </div>

      <div className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
        {filteredData.map(item => {
          if (item.type === 'album') {
            return (
              <AlbumBox
                key={item.id}
                album={item}
                className='col-span-1 row-span-1 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2'
              />
            )
          }
          if (item.type === 'song') {
            return <SongBox key={item.id} song={item} />
          }
          if (item.type === 'artist') {
            return <ArtistBox key={item.id} artist={item} />
          }
          return null
        })}
      </div>
    </div>
  )
}
{
  /* <div>
  <h3>Albums</h3>
  <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
    {albums.map(album => (
      <AlbumBox key={album.id} album={album} />
    ))}
  </ul>
</div>
<div>
  <h3>Singles</h3>
  <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
    {songs.map(song => (
      <SongBox key={song.id} song={song} />
    ))}
  </ul>
</div>
<div>
  <h3>Artists</h3>
  <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
    {artists.map(artist => (
      <ArtistBox key={artist.id} artist={artist} />
    ))}
  </ul>
</div> */
}

import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
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
  const { albums, songs, artists, data } = useLoaderData<LoaderData>()

  return (
    <div className='px-10'>
      <div className='px-10'>
        <div className='grid-auto-flow-dense grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {data.map(item => {
            if (item.type === 'album') {
              return (
                <AlbumBox
                  key={item.id}
                  album={item}
                  className='col-span-2 row-span-2'
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

      <div>
        <h3>Albums</h3>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {albums.map(album => (
            <AlbumBox key={album.id} album={album} />
          ))}
        </ul>
      </div>
      <div>
        <h3>Singles</h3>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {songs.map(song => (
            <SongBox key={song.id} song={song} />
          ))}
        </ul>
      </div>
      <div>
        <h3>Artists</h3>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {artists.map(artist => (
            <ArtistBox key={artist.id} artist={artist} />
          ))}
        </ul>
      </div>
    </div>
  )
}

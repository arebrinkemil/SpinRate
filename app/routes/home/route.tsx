import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
import { requireAuthCookie } from '~/auth/auth'
import { getAlbums, getSingleSongs } from './queries'
import { truncateText } from '~/utils/truncate'

import {
  getAverageAlbumRating,
  getAverageSongRating,
} from '~/utils/averageRating'
import { AlbumBox, SongBox } from '~/components/ContentBoxes'

export const meta: MetaFunction = () => {
  return [{ title: 'SPINRATE' }]
}

type LoaderData = {
  albums: any[]
  songs: any[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthCookie(request)

  const albums = await getAlbums()
  const songs = await getSingleSongs()

  const albumsWithRatings = await Promise.all(
    albums.map(async album => {
      const averageRating = await getAverageAlbumRating(album.id)
      return { ...album, averageRating }
    }),
  )

  const songsWithRatings = await Promise.all(
    songs.map(async song => {
      const averageRating = await getAverageSongRating(song.id)
      return { ...song, averageRating }
    }),
  )

  return json<LoaderData>({
    albums: albumsWithRatings,
    songs: songsWithRatings,
  })
}

export default function Home() {
  const { albums, songs } = useLoaderData<LoaderData>()

  return (
    <div className='px-10'>
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
    </div>
  )
}

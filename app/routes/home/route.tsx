import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
import { requireAuthCookie } from '~/auth/auth'
import { getAlbums, getSingleSongs } from './queries'
import { truncateText } from '~/utils/truncate'
import CornerMarkings from '~/components/CornerMarkings'
import AverageRating from '~/components/AverageRating'
import {
  getAverageAlbumRating,
  getAverageSongRating,
} from '~/utils/averageRating'

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
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {albums.map((album: any) => (
            <Link to={`/album/${album.id}`} key={album.id}>
              <CornerMarkings
                className='aspect-square'
                key={album.id}
                hoverEffect={true}
              >
                <li className='h-full bg-black'>
                  <div className='flex h-4/6 w-full flex-row'>
                    <img
                      src={album.imageUrl}
                      alt={album.name}
                      className='h-full w-4/6'
                    />
                    <AverageRating
                      className='flex h-full w-2/6 items-center justify-center text-white'
                      averageRating={album.averageRating}
                    />
                  </div>
                  <h1 className='text-platinum text-xl'>{album.name}</h1>
                  <p className='text-lg text-white'>{album.artistName}</p>
                </li>
              </CornerMarkings>
            </Link>
          ))}
        </ul>
      </div>
      <div>
        <h3>Singles</h3>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {songs.map((song: any) => (
            <Link to={`/song/${song.id}`} key={song.id}>
              <CornerMarkings
                className='aspect-square'
                key={song.id}
                hoverEffect={true}
              >
                <li className='flex h-full w-full flex-col bg-black p-4'>
                  <div className='flex h-4/6 w-full flex-row'>
                    <img
                      src={song.imageUrl}
                      alt={song.name}
                      className='h-full w-4/6'
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
          ))}
        </ul>
      </div>
    </div>
  )
}

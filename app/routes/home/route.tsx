import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
import { requireAuthCookie } from '~/auth/auth'
import { getAlbums, getSingleSongs } from './queries'
import { truncateText } from '~/utils/truncate'
import CornerMarkings from '~/components/CornerMarkings'
import AverageRating from '~/components/AverageRating'

export const meta: MetaFunction = () => {
  return [{ title: 'SPINRATE' }]
}

type LoaderData = {
  albums: any[]
  songs: any[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const albums = await getAlbums()
  const songs = await getSingleSongs()

  return json<LoaderData>({
    albums,
    songs,
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
              <CornerMarkings key={album.id} hoverEffect={true}>
                <li className='h-full bg-black'>
                  <h1 className='text-platinum text-2xl'>{album.name}</h1>
                  <img
                    src={album.imageUrl}
                    alt={album.name}
                    className='h-full w-full object-cover'
                  />
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
              <CornerMarkings key={song.id} hoverEffect={true}>
                <li className='flex h-full w-full flex-col bg-black p-4'>
                  <img
                    src={song.imageUrl}
                    alt={song.name}
                    className='h-4/6 w-4/6'
                  />
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

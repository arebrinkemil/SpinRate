import { json, LoaderFunction } from '@remix-run/node'
import { prisma } from '~/db/prisma'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Input } from '@nextui-org/react'
import { truncateText } from '~/utils/truncate'

type SearchLoaderData = {
  artists: { id: string; name: string }[]
  albums: { id: string; name: string }[]
  songs: { id: string; name: string }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''

  const artists = await prisma.artist.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
  })

  const albums = await prisma.album.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { artist: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      artist: true,
    },
  })

  const songs = await prisma.song.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { artistName: { contains: query, mode: 'insensitive' } },
      ],
    },
  })

  return json<SearchLoaderData>({ artists, albums, songs })
}

export default function Search() {
  const { artists, albums, songs } = useLoaderData<SearchLoaderData>()
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const limit = 25

  return (
    <motion.div
      className='text-silver mt-[-44px] bg-black'
      initial={{ y: '-100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <Form
        className='flex w-full justify-center pb-10 pt-20'
        method='get'
        action='/search'
      >
        <Input
          autoFocus
          isClearable
          id='search'
          label='Search'
          variant='bordered'
          type='text'
          name='q'
          placeholder='Search for artists, songs, albums...'
          onClear={() => console.log('input cleared')}
          className='input-white dark w-1/4 border-white text-white'
          radius='none'
        />

        <button type='submit'>Search</button>
      </Form>

      <div className='mx-8 flex min-h-screen w-full flex-row justify-around'>
        <div>
          <h2>Artists</h2>
          <ul>
            {artists.slice(0, limit).map(artist => (
              <li key={artist.id} className='hover:text-white hover:underline'>
                <Link className='block lg:hidden' to={`/artist/${artist.id}`}>
                  {truncateText(artist.name, 16)}
                </Link>
                <Link className='hidden lg:block' to={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Albums</h2>
          <ul>
            {albums.map(album => (
              <li key={album.id} className='hover:text-white hover:underline'>
                <Link className='block lg:hidden' to={`/album/${album.id}`}>
                  {truncateText(album.name, 16)}
                </Link>
                <Link className='hidden lg:block' to={`/song/${album.id}`}>
                  {album.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Songs</h2>
          <ul>
            {songs.map(song => (
              <li key={song.id} className='hover:text-white hover:underline'>
                <Link className='block lg:hidden' to={`/song/${song.id}`}>
                  {truncateText(song.name, 16)}
                </Link>
                <Link className='hidden lg:block' to={`/song/${song.id}`}>
                  {song.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

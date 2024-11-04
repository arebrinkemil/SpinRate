import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, Link, MetaFunction } from '@remix-run/react'
import { useState } from 'react'
import { getAlbumData, getSongData, getArtistData } from '~/utils/queries'
import { getAverageRating } from '~/utils/ratingLogic'
import { AlbumBox, SongBox, ArtistBox } from '~/components/ContentBoxes'
import { client } from '~/sanity/client'
import { SanityDocument } from '@sanity/client'
import { S } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import Banner from '~/components/Banner'

export const meta: MetaFunction = () => {
  return [{ title: 'SPINRATE' }]
}

type LoaderData = {
  data: any[]
  sanityData: SanityDocument[]
  bannerData: SanityDocument[]
}

const POSTS_QUERY = `*[_type == "featuredContent"]{
  _id,
  _createdAt,
  songs,
  artists,
  albums
}
`

const BANNER_QUERY = `*[_type == "banner"]{
  mainImage{
    asset->{
      _id,
      url
    },
    hotspot
  },
  smallImages[]{
    asset->{
      _id,
      url
    }
  },
  header,
  bodyText,
  links[]{
    text,
    url
  }
}
`

const HIGHLIGHT_QUERY = `*[_type == "highlight"]{
 
  header,
  bodyText,
  highlightIDs[]{
    text,
    url,
    type
  }
}
`

function shuffleArray<T>(array: T[] = []): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const loader: LoaderFunction = async ({ request }) => {
  const sanityData = await client.fetch<SanityDocument[]>(POSTS_QUERY)
  const bannerData = await client.fetch<SanityDocument[]>(BANNER_QUERY)
  const highlightedContent =
    await client.fetch<SanityDocument[]>(HIGHLIGHT_QUERY)

  const albumsWithRatings = await Promise.all(
    sanityData
      .flatMap(doc => doc.albums ?? [])
      .map(async id => {
        const album = await getAlbumData(id)
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          'ALBUM',
        )
        return { ...album, verifiedAverage, unverifiedAverage, type: 'album' }
      }),
  )

  const songsWithRatings = await Promise.all(
    sanityData
      .flatMap(doc => doc.songs ?? [])
      .map(async id => {
        const song = await getSongData(id)
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          'SONG',
        )
        return { ...song, verifiedAverage, unverifiedAverage, type: 'song' }
      }),
  )

  const artistsWithRatings = await Promise.all(
    sanityData
      .flatMap(doc => doc.artists ?? [])
      .map(async id => {
        const artist = await getArtistData(id)
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          'ARTIST',
        )
        return { ...artist, verifiedAverage, unverifiedAverage, type: 'artist' }
      }),
  )

  const combinedData = shuffleArray([
    ...albumsWithRatings,
    ...songsWithRatings,
    ...artistsWithRatings,
  ])

  return json<LoaderData>({
    data: combinedData,
    sanityData,
    bannerData,
  })
}

export default function Home() {
  const { data, sanityData, bannerData } = useLoaderData<LoaderData>()

  const [filter, setFilter] = useState<'all' | 'album' | 'song' | 'artist'>(
    'all',
  )

  const filteredData = data.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  return (
    <div className=' px-10'>
      <div className='flex flex-row items-center justify-between'>
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
        {/* TODO: sort by rating */}
        <div className='mb-4 flex flex-row gap-4 bg-black px-2'>
          <p className='text-[#79B473]'>VERIFIED</p>
          <p className='text-[#F4442E]'>PUBLIC</p>
        </div>
      </div>

      <div className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
        <Banner data={bannerData[1]} />

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

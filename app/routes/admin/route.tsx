import { json, LoaderFunction, ActionFunction } from '@remix-run/node'
import { useLoaderData, Form, useActionData, Link } from '@remix-run/react'
import { requireAuthCookie } from '~/auth/auth'
import AverageRating from '../../components/AverageRating'
import {
  findOrCreateArtist,
  findOrCreateAlbum,
  findOrCreateSong,
  getCollectedSongs,
  getArtistSongs,
  getArtists,
} from './queries'
import { getAverageRating } from '~/utils/averageRating'
import { motion } from 'framer-motion'
import { truncateText } from '~/utils/truncate'
import CornerMarkings from '~/components/CornerMarkings'

type LoaderData = {
  accessToken: string
  playlistTracks: any[]
  collectedSongs: any[]
  getArtistsData: any[]
  artistSongs: { [key: string]: any[] }
  ratings: { [key: string]: number | null }
}

async function getAccessToken() {
  const clientId = '9af521734cb2462f92441df6c7c9dd25'
  const clientSecret = 'd2087f4f4daf44ffacf9c1c0d38b3093'

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`,
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}
async function fetchPlaylistTracks(playlistId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const data = await response.json()
  return data.items
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireAuthCookie(request)
  const accessToken = await getAccessToken()

  const playlistId = '4Dp9GntziqpMwIs1oAoMUC'

  let playlistTracks = []
  if (playlistId) {
    playlistTracks = await fetchPlaylistTracks(playlistId, accessToken)
  }

  const collectedSongs = await getCollectedSongs()
  const getArtistsData = await getArtists()

  const artistSongs: { [key: string]: any[] } = {}
  const ratings: { [key: string]: number | null } = {}

  await Promise.all(
    getArtistsData.map(async artist => {
      const songs = await getArtistSongs(artist.id)
      artistSongs[artist.id] = songs

      await Promise.all(
        songs.map(async song => {
          ratings[song.id] = await getAverageRating(song.id)
        }),
      )
    }),
  )

  return json<LoaderData>({
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs,
    ratings,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const accessToken = formData.get('accessToken') as string
  const playlistId = formData.get('playlistId') as string
  const addAlbum = formData.get('addFromAlbum') as string

  const playlistTracks = await fetchPlaylistTracks(playlistId, accessToken)

  for (const item of playlistTracks) {
    const track = item.track
    const artistNames = track.artists.map((artist: any) => artist.name)

    const artistIds = []
    for (const name of artistNames) {
      const artist = await findOrCreateArtist(name)
      artistIds.push(artist.id)
    }

    const albumName = track.album.name
    const artistName = track.artists[0].name

    if (track.album.album_type !== 'single' && addAlbum) {
      const album = await findOrCreateAlbum(
        albumName,
        artistIds[0],
        accessToken,
        track.album.release_date,
        track.album.album_type,
        track.album.external_urls.spotify,
        track.album.id,
      )
      await findOrCreateSong(
        track.name,
        artistIds[0],
        album.id,
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url,
        artistName,
      )
    } else {
      await findOrCreateSong(
        track.name,
        artistIds[0],
        null,
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url,
        artistName,
      )
    }
  }

  return json({ success: true })
}

export default function SpotifyPlaylistTracks() {
  const {
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs,
    ratings,
  } = useLoaderData<LoaderData>()

  const actionData = useActionData<{ success: boolean }>()

  return (
    <div className='px-10'>
      <h1 className='text-2xl'>Add songs to database</h1>
      <Form method='post'>
        <div className='flex flex-col'>
          <div className='flex flex-row'>
            <label htmlFor='playlistId'>Enter Spotify Playlist ID:</label>
            <input type='text' name='playlistId' id='playlistId' required />
          </div>
          <label>
            <input type='checkbox' name='addFromAlbum' value='true' /> Add all
            songs from related albums
          </label>{' '}
          <input type='hidden' name='accessToken' value={accessToken} />
          <input
            type='hidden'
            name='playlistTracks'
            value={JSON.stringify(playlistTracks)}
          />
          <CornerMarkings hoverEffect={false} className='w-1/3'>
            <button className='p-2' type='submit'>
              Process Playlist
            </button>
          </CornerMarkings>
        </div>
      </Form>
      {actionData?.success && (
        <p>Playlist processed and saved to the database!</p>
      )}

      <div>
        <h3>Artists</h3>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {getArtistsData.map((artist: any) => (
            <CornerMarkings key={artist.id} hoverEffect={true}>
              <li className='h-full bg-black'>
                <h1 className='text-platinum text-2xl'>{artist.name}</h1>
                <ul className='grid grid-cols-2 gap-2 p-4'>
                  {artistSongs[artist.id].map((song: any) => (
                    <Link to={`/song/${song.id}`} key={song.id}>
                      <li
                        className='bg-blue hover:bg-hallon relative flex h-full flex-col items-center justify-between gap-5 p-2 text-white'
                        style={{
                          backgroundImage: `url(${song.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className='rounded bg-black bg-opacity-50 p-2'>
                          {truncateText(song.name, 16)}
                        </div>
                        <div className='rounded bg-black bg-opacity-50 p-2'>
                          <AverageRating averageRating={ratings[song.id]} />
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </li>
            </CornerMarkings>
          ))}
        </ul>
      </div>
    </div>
  )
}

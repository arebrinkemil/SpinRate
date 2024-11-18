import { json } from '@remix-run/node'
import { prisma } from '~/db/prisma'
import {
  findOrCreateArtist,
  findOrCreateAlbum,
  findOrCreateSong,
} from '~/routes/admin/queries'

export async function getSongs() {
  return await prisma.song.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      albumId: null,
    },
  })
}

export async function getArtists() {
  return await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export async function getAlbums() {
  return await prisma.album.findMany({
    select: {
      id: true,
      name: true,
    },
  })
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

export async function getNewMusic() {
  try {
    console.log('Getting new music...')
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.spotify.com/v1/browse/new-releases`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`)
    }

    const data = await response.json()

    for (const album of data.albums.items) {
      const artistSpotifyIds = album.artists.map((artist: any) => artist.id)

      const artistIds = []
      for (const id of artistSpotifyIds) {
        const artist = await findOrCreateArtist(id, accessToken)
        artistIds.push(artist.id)
      }

      const albumName = album.name
      const artistName = album.artists[0].name

      if (album.album_type !== 'single') {
        const albumData = await findOrCreateAlbum(
          albumName,
          artistIds[0],
          accessToken,
          album.release_date,
          album.album_type,
          album.external_urls.spotify,
          album.id,
          album.images[0].url,
        )
        const tracks = await fetchAlbumSongs(album.id, accessToken)
        for (const track of tracks) {
          await findOrCreateSong(
            track.id,
            track.name,
            artistIds[0],
            albumData.id,
            track.duration_ms,
            album.release_date,
            track.external_urls.spotify,
            album.images[0].url,
            artistName,
          )
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in getNewMusic:', error)
    throw error
  }
}

async function fetchAlbumSongs(albumId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const data = await response.json()
  return data.items
}

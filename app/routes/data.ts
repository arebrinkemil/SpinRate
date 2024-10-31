import { json } from '@remix-run/node'
import { getSongs, getArtists, getAlbums } from './queries'

export const loader = async ({ request }: { request: Request }) => {
  //   const url = new URL(request.url)
  //   const pass = url.searchParams.get('pass') passowrd for the api

  try {
    const songData = await getSongs()
    const artistData = await getArtists()
    const albumData = await getAlbums()

    if (!songData || !artistData || !albumData) {
      return json({ error: 'Data not found' }, { status: 404 })
    }

    const combinedData = {
      songs: songData,
      artists: artistData,
      albums: albumData,
    }

    return json(combinedData)
  } catch (error) {
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

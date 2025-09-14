import { json } from '@remix-run/node'
import { prisma } from '~/db/prisma'

export async function loader() {
  try {
    // Fetch all songs, artists, and albums for the CMS
    const [songs, artists, albums] = await Promise.all([
      prisma.song.findMany({
        select: {
          id: true,
          name: true,
          artistName: true,
          imageUrl: true,
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.artist.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.album.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          artist: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    ])

    // Format the data for the CMS component
    const formattedData = {
      songs: songs.map(song => ({
        id: song.id,
        name: `${song.name}${song.artistName ? ` - ${song.artistName}` : ''}`,
        imageUrl: song.imageUrl
      })),
      artists: artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.imageUrl
      })),
      albums: albums.map(album => ({
        id: album.id,
        name: `${album.name}${album.artist?.name ? ` - ${album.artist.name}` : ''}`,
        imageUrl: album.imageUrl
      }))
    }

    return json(formattedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error fetching data for CMS:', error)
    return json(
      { error: 'Failed to fetch data' }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

// Handle CORS preflight requests
export async function options() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
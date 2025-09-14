import { Album, AlbumType, Artist } from '@prisma/client'
import { prisma } from '~/db/prisma'

// Map Spotify album types to our enum
function mapSpotifyAlbumType(spotifyType: string): AlbumType {
  switch (spotifyType?.toLowerCase()) {
    case 'album':
      return AlbumType.ALBUM
    case 'single':
      return AlbumType.SINGLE
    case 'compilation':
      return AlbumType.COMPILATION
    case 'ep':
      return AlbumType.EP
    default:
      return AlbumType.ALBUM // Default fallback
  }
}

export async function findOrCreateArtist(spotifyId: string, accessToken: string) {
  let artist = await prisma.artist.findFirst({ where: { spotifyId } })
  if (!artist) {
    try {
      const artistData = await fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      
      if (!artistData.ok) {
        throw new Error(`Failed to fetch artist data: ${artistData.statusText}`)
      }
      
      const data = await artistData.json()
      
      // Handle missing data gracefully
      const imageUrl = data.images && data.images.length > 0 ? data.images[0].url : null
      const name = data.name || 'Unknown Artist'
      const spotifyUrl = data.external_urls?.spotify || null
      
      artist = await prisma.artist.create({
        data: { 
          name, 
          imageUrl, 
          spotifyId: spotifyId,
          spotifyUrl
        },
      })
      console.log('Created artist: ' + artist.name)
    } catch (error) {
      console.error(`Error creating artist with Spotify ID ${spotifyId}:`, error)
      throw error
    }
  }
  return artist
}

export async function findOrCreateAlbum(
  name: string,
  artistId: string,
  accessToken: string,
  releaseDate: string,
  spotifyAlbumType: string,
  spotifyUrl: string,
  spotifyAlbumId: string,
  imageUrl: string,
) {
  let album = await prisma.album.findFirst({
    where: { spotifyId: spotifyAlbumId },
  })
  if (!album) {
    try {
      // Map Spotify album type to our enum
      const albumType = mapSpotifyAlbumType(spotifyAlbumType)
      
      // Handle invalid date
      let validReleaseDate: Date
      try {
        validReleaseDate = new Date(releaseDate)
        if (isNaN(validReleaseDate.getTime())) {
          validReleaseDate = new Date()
        }
      } catch {
        validReleaseDate = new Date()
      }
      
      album = await prisma.album.create({
        data: {
          name: name || 'Unknown Album',
          artistId,
          releaseDate: validReleaseDate,
          type: albumType,
          spotifyId: spotifyAlbumId,
          spotifyUrl: spotifyUrl || null,
          imageUrl: imageUrl || null,
        },
      })

      const albumSongs = await fetchAlbumSongs(spotifyAlbumId, accessToken)
      await addSongsToDatabase(albumSongs, artistId, album.id)
      console.log('Created album: ' + album.name)
    } catch (error) {
      console.error(`Error creating album with Spotify ID ${spotifyAlbumId}:`, error)
      throw error
    }
  }
  return album
}

export async function fetchAlbumSongs(albumId: string, accessToken: string) {
  const albumResponse = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const albumData = await albumResponse.json()

  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const data = await response.json()

  data.items.forEach((item: any) => {
    item.album = { images: albumData.images }
  })

  return data.items
}

export async function addSongsToDatabase(
  songs: any[],
  artistId: string,
  albumId: string | null,
  artistName?: string,
) {
  console.log('Adding songs to database...')
  for (const song of songs) {
    const imageUrl = song.album?.images?.[0]?.url || 'default_image_url'
    await findOrCreateSong(
      song.id,
      song.name,
      artistId,
      albumId ?? null,
      song.duration_ms,
      song.release_date,
      song.external_urls.spotify,
      imageUrl,
      artistName,
    )
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export async function findOrCreateSong(
  spotifySongId: string,
  name: string,
  artistId: string,
  albumId: string | null,
  duration: number,
  releaseDate: string,
  spotifyUrl: string,
  imageUrl: string,
  artistName?: string,
) {
  if (albumId === 'single') {
    albumId = null
  }

  let song = await prisma.song.findFirst({
    where: {
      spotifyId: spotifySongId,
    },
  })

  if (!song) {
    try {
      // Handle invalid dates
      let validReleaseDate: Date
      try {
        validReleaseDate = isValidDate(releaseDate) ? new Date(releaseDate) : new Date()
      } catch {
        validReleaseDate = new Date()
      }

      if (albumId) {
        const album = await prisma.album.findFirst({
          where: { id: albumId },
        })
        if (album) {
          validReleaseDate = album.releaseDate
        }
      }

      song = await prisma.song.create({
        data: {
          name: name || 'Unknown Song',
          artistId,
          albumId,
          duration: duration || 0,
          releaseDate: validReleaseDate,
          spotifyId: spotifySongId,
          spotifyUrl: spotifyUrl || null,
          imageUrl: imageUrl || null,
          artistName: artistName || null,
        },
      })
      console.log('Created song: ' + song.name)
    } catch (error) {
      console.error(`Error creating song with Spotify ID ${spotifySongId}:`, error)
      throw error
    }
  }

  return song
}

export async function getCollectedSongs() {
  return await prisma.song.findMany()
}

export async function getArtists(offset: number = 0, limit: number = 10) {
  return await prisma.artist.findMany({
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  })
}

export async function getArtistSongs(
  artistId: string,
  offset: number = 0,
  limit: number = 100,
) {
  return await prisma.song.findMany({
    where: { artistId },
    skip: offset,
    take: limit,
    orderBy: { name: 'asc' },
  })
}

export async function getAverageRating(songId: string): Promise<number> {
  const ratings = await prisma.rating.findMany({
    where: {
      songId: songId,
    },
  })
  const total = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0)
  return total / ratings.length
}

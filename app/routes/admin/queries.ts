import { Album, AlbumType, Artist } from '@prisma/client'
import { prisma } from '~/db/prisma'

export async function findOrCreateArtist(id: string, accessToken: string) {
  let artist = await prisma.artist.findFirst({ where: { id } })
  if (!artist) {
    const artistData = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await artistData.json()
    artist = await prisma.artist.create({
      data: { id, name: data.name, imageUrl: data.images[0].url },
    })
    console.log('Created artist: ' + artist.name)
  }
  return artist
}

export async function findOrCreateAlbum(
  name: string,
  artistId: string,
  accessToken: string,
  releaseDate: string,
  type: AlbumType,
  spotifyUrl: string,
  albumId: string,
  imageUrl: string,
) {
  let album = await prisma.album.findFirst({
    where: { name, artistId },
  })
  if (!album) {
    album = await prisma.album.create({
      data: {
        name,
        artistId,
        releaseDate: new Date(releaseDate),
        type,
        spotifyUrl,
        imageUrl,
      },
    })

    const albumSongs = await fetchAlbumSongs(albumId, accessToken)
    await addSongsToDatabase(albumSongs, artistId, album.id)
    console.log('Created album: ' + album.name)
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
  id: string,
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
      id,
    },
  })

  if (!song) {
    let validReleaseDate = isValidDate(releaseDate)
      ? new Date(releaseDate)
      : new Date()

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
        id,
        name,
        artistId,
        albumId,
        duration,
        releaseDate: validReleaseDate,
        spotifyUrl,
        imageUrl,
        artistName,
      },
    })
    console.log('Created song: ' + song.name)
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

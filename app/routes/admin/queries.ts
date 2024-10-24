import { Album, AlbumType } from '@prisma/client'
import { prisma } from '~/db/prisma'

export async function findOrCreateArtist(name: string) {
  let artist = await prisma.artist.findFirst({ where: { name } })
  if (!artist) {
    artist = await prisma.artist.create({ data: { name } })
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
  console.log('Finding or creating album...')
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

async function fetchAlbumSongs(albumId: string, accessToken: string) {
  console.log(albumId + 'albumId')

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
  albumId?: string,
  artistName?: string,
) {
  console.log('Adding songs to database...')
  for (const song of songs) {
    const imageUrl = song.album?.images?.[0]?.url || 'default_image_url'
    await findOrCreateSong(
      song.name,
      artistId,
      albumId,
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
  name: string,
  artistId: string,
  albumId: string | null | undefined,
  duration: number,
  releaseDate: string,
  spotifyUrl: string,
  imageUrl: string,
  artistName?: string,
) {
  let song = await prisma.song.findFirst({
    where: { name, artistId },
  })
  if (!song) {
    const validReleaseDate = isValidDate(releaseDate)
      ? new Date(releaseDate)
      : new Date()
    song = await prisma.song.create({
      data: {
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
  console.log('Getting collected songs...')
  return await prisma.song.findMany()
}

export async function getArtists() {
  console.log('Getting artists...')
  return await prisma.artist.findMany()
}

export async function getArtistSongs(artistId: string) {
  console.log('Getting artist songs...')
  return await prisma.song.findMany({ where: { artistId } })
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

import { prisma } from '~/db/prisma'

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

export async function getAlbums() {
  console.log('Getting albums with songs...')
  return await prisma.album.findMany({
    include: {
      songs: true,
    },
  })
}
export async function getAlbumSongs(albumId: string) {
  console.log('Getting album songs...')
  return await prisma.song.findMany({ where: { albumId } })
}

export async function getSingleSongs() {
  console.log('Getting single songs...')
  return await prisma.song.findMany({ where: { albumId: null } })
}

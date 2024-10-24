import { prisma } from '~/db/prisma'
import { Artist } from '@prisma/client'

export async function getArtistsBySong(songId: string): Promise<Artist[]> {
  const songs = await prisma.song.findMany({
    where: {
      id: songId,
    },
    include: {
      artist: true,
    },
  })

  const artists = songs.map(song => song.artist)
  return artists
}

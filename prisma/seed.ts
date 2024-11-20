import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const accountId = "7225d367-49dd-4fa0-92a7-2dff1c42c8c2";

async function main() {
  const songs = await prisma.song.findMany();
  const albums = await prisma.album.findMany();
  const artists = await prisma.artist.findMany();

  const createRatings = async (
    type: "song" | "album" | "artist",
    id: string
  ) => {
    const verifiedRating = {
      ratingValue: faker.number.int({ min: 1, max: 10 }),

      verified: true,
      userId: accountId,
      [`${type}Id`]: id,
    };

    const unverifiedRating = {
      ratingValue: faker.number.int({ min: 1, max: 10 }),
      verified: false,
      userId: accountId,
      [`${type}Id`]: id,
    };

    await prisma.rating.createMany({
      data: [verifiedRating, unverifiedRating],
    });
  };

  for (const song of songs) {
    await createRatings("song", song.id);
  }

  for (const album of albums) {
    await createRatings("album", album.id);
  }

  for (const artist of artists) {
    await createRatings("artist", artist.id);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

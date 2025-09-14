import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const accountId = "7225d367-49dd-4fa0-92a7-2dff1c42c8c2";

async function main() {
  // Ensure a user exists to reference in ratings
  await prisma.user.upsert({
    where: { id: accountId },
    update: {},
    create: {
      id: accountId,
      name: "Seed User",
      email: "seed-user@example.com",
    },
  });

  const songs = await prisma.song.findMany();
  const albums = await prisma.album.findMany();
  const artists = await prisma.artist.findMany();

  const createRatings = async (
    type: "song" | "album" | "artist",
    id: string
  ) => {
    const ratingA = {
      ratingValue: faker.number.int({ min: 1, max: 10 }),
      userId: accountId,
      targetId: id,
      targetType: type,
    };

    const ratingB = {
      ratingValue: faker.number.int({ min: 1, max: 10 }),
      userId: accountId,
      targetId: id,
      targetType: type,
    };

    await prisma.rating.createMany({
      data: [ratingA, ratingB],
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

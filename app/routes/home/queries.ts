import { prisma } from "~/db/prisma";

export async function deleteItem(itemId: number, accountId: string) {
  return prisma.item.delete({
    where: { id: itemId, accountId },
  });
}

export async function createItem(userId: string, name: string) {
  return prisma.item.create({
    data: {
      name,
      Account: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getHomeData(userId: string) {
  return prisma.item.findMany({
    where: {
      accountId: userId,
    },
  });
}

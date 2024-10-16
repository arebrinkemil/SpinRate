import { prisma } from './prisma.server'

export async function getItems() {
  return prisma.item.findMany()
}

export async function createItem(name: string) {
  return prisma.item.create({ data: { name } })
}

// app/utils/prisma.server.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

// Avoid multiple instances of Prisma in development
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
  }
  prisma = global.__db
}

export { prisma }

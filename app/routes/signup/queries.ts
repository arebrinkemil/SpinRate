import crypto from 'crypto'

import { prisma } from '~/db/prisma'

export async function accountExists(email: string) {
  let account = await prisma.account.findUnique({
    where: { email: email },
    select: { id: true },
  })

  return Boolean(account)
}

export async function createAccount(
  email: string,
  password: string,
  username: string,
  firstName?: string,
  lastName?: string,
  description?: string,
  profileImageUrl?: string,
) {
  let salt = crypto.randomBytes(16).toString('hex')
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex')

  return prisma.account.create({
    data: {
      email: email,
      Password: { create: { hash, salt } },
      username: username,
      firstName: firstName || '',
      lastName: lastName || '',
      description: description || '',
      profileImageUrl: profileImageUrl || '',
    },
  })
}

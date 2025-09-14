import crypto from "crypto";
import { prisma } from "~/db/prisma";

export async function accountExists(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !!user;
}

export async function createAccount(
  email: string,
  password: string,
  username: string,
  firstName?: string,
  lastName?: string,
  description?: string,
  profileImageUrl?: string
) {
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha256")
    .toString("hex");

  return prisma.user.create({
    data: {
      email: email,
      username: username,
      firstName: firstName || "",
      lastName: lastName || "",
      description: description || "",
      profileImageUrl: profileImageUrl || "",
      password: {
        create: {
          hash,
          salt,
        },
      },
    },
  });
}

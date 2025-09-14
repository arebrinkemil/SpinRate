import crypto from "crypto";
import { prisma } from "~/db/prisma";

export async function login(email: string, password: string) {
  let user = await prisma.user.findUnique({
    where: { email: email },
    include: { password: true },
  });

  if (!user || !user.password) {
    return false;
  }

  let hash = crypto
    .pbkdf2Sync(password, user.password.salt, 1000, 64, "sha256")
    .toString("hex");

  if (hash !== user.password.hash) {
    return false;
  }

  return user.id;
}

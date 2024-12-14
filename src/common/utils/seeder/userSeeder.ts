import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedTestUser() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: "seederUser1@example.com",
      name: "John Doe",
      password: "password",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "seederUser2@example.com",
      name: "Jane Doe",
      password: "password",
    },
  });

  // biome-ignore lint/suspicious/noConsole: console.log is used for debugging purposes
  console.log({ user1, user2 });
  return [user1, user2];
}

export async function deleteTestUser() {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: "seederUser",
      },
    },
  });
}

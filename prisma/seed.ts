import { PrismaClient } from "@prisma/client";
import { seedTestUser } from "../src/common/utils/seeder/userSeeder";

const prisma = new PrismaClient();

async function main() {
  seedTestUser();
}

main()
  .catch((e) => {
    // biome-ignore lint/suspicious/noConsole: console.log is used for debugging purposes
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

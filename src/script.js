const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.user.create({
    data: {
      
    }
  })
  console.log(data);
}

main()
  .catch((e) => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect();
  });

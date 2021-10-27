const { PrismaClient } = require('@prisma/client');
const { argsToArgsConfig } = require('graphql/type/definition');

const prisma = new PrismaClient();

async function main() {
  const data = prisma.link.findMany({
    where: {
      OR: [
        {
          description: {
            contains: args.filter
          }
        },
        {
          url: {
            contains: args.filter
          }
        }
      ]
    },
    take: 10,
    skip: 10,
    orderBy: { createdAt: 'asc' }
  });

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

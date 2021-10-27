async function feed(parent, args, context, info) {
  const { take, skip, orderBy } = args;
  const where = args.filter
    ? {
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
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    take,
    skip,
    orderBy
  });

  const count = await context.prisma.link.count({ where });

  return {
    links,
    count
  };
}

module.exports = {
  feed
};

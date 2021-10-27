function feed(parent, args, context, info) {
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

  return context.prisma.link.findMany({
    where,
    take,
    skip,
    orderBy
  });
}

module.exports = {
  feed
};

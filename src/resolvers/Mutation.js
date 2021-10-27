const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      email: args.email,
      name: args.name,
      password
    }
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email
    }
  });

  if (!user) throw new Error('No such user');

  const validUser = await bcrypt.compare(args.password, user.password);

  if (!validUser) throw new Error('Password invalid');

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: {
          id: userId
        }
      }
    }
  });
}

module.exports = {
  login,
  signup,
  post
};

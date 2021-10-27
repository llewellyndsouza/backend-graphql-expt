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

  const newPost = await context.prisma.link.create({
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

  context.pubsub.publish('NEW_LINK', newPost);

  return newPost;
}

async function vote(parent, args, context, info) {
  const { userId } = context;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId
      }
    }
  });
  if (!!vote) throw new Error(`Already voted for link: ${args.linkId}`);

  const newVote = await context.prisma.vote.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      link: {
        connect: {
          id: Number(args.linkId)
        }
      }
    }
  });

  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
}

module.exports = {
  login,
  signup,
  post,
  vote
};

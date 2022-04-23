import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import UserResolver from './resolvers/user';
import { SECRET_KEY } from './utils/constants';

const prisma = new PrismaClient();

const MongoDBStore = connectMongoDBSession(session);

async function main() {
  console.log('Creating server...');
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: async ({ req, res }) => ({
      ...req,
      ...res,
      prisma,
    }),
  });

  console.log('Starting apollo...');
  await server.start();

  console.log('Starting server...');
  const app = express();

  console.log('Connecting with sessions db...');
  const store = new MongoDBStore({
    uri: process.env.DATABASE_URL || '',
    collection: 'LiteTwitterSessions',
  });

  store.on('error', error => {
    console.error(error);
  });

  app.use(
    session({
      store,
      secret: SECRET_KEY,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  server.applyMiddleware({ app });

  app.listen(parseInt(process.env.PORT || '4000'), () => {
    console.log(
      `Server started on https://localhost:${process.env.PORT || 4000}${
        server.graphqlPath
      }`
    );
  });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

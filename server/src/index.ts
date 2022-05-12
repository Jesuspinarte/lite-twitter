import 'reflect-metadata';
import 'dotenv-safe/config';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import UserResolver from './resolvers/user';
import { COOKIE_NAME, SECRET_KEY } from './utils/constants';
import TweetResolver from './resolvers/tweet';
import VoteResolver from './resolvers/vote';

// PUB SUB IMPORTS
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { graphqlUploadExpress } from 'graphql-upload';

export const prisma = new PrismaClient();
const pubsub = new PubSub();

const MongoDBStore = connectMongoDBSession(session);

async function main() {
  console.log('💻 Starting server...');
  const app = express();

  console.log('💾 Creating http server...');
  const httpServer = createServer(app);

  console.log('📄 Creating schema...');
  const schema = await buildSchema({
    resolvers: [TweetResolver, UserResolver, VoteResolver],
    validate: false,
    pubSub: pubsub
  });

  console.log('📩 Creating WebSocket server...');
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
    clientTracking: true,
  });

  console.log('👂🏽 WebSocketServer start listening...');
  const serverCleanup = useServer({ schema }, wsServer);

  console.log('👥 Connecting with sessions db...');
  const store = new MongoDBStore({
    uri: process.env.DATABASE_URL || '',
    collection: 'LiteTwitterSessions',
  });

  store.on('error', error => {
    console.error('❌ ERROR ❌', error);
  });

  // Add cors
  app.use(
    cors({
      origin: [
        process.env.CORS_ORIGIN || '',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store,
      secret: SECRET_KEY,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        // maxAge: 1000 * 60, // 1 minute
        // maxAge: 1000 * 30, // 30 seconds
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(graphqlUploadExpress());

  console.log('💿 Creating server...');
  const server = new ApolloServer({
    schema: schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async ({ req, res }) => ({
      ...req,
      ...res,
      prisma,
      pubsub,
    }),
  });

  console.log('▶ Starting apollo...');
  await server.start();

  server.applyMiddleware({ app, cors: false });

  httpServer.listen(parseInt(process.env.PORT || '4000'), () => {
    console.log(
      `🌐 Server started on https://localhost:${process.env.PORT || 4000}${server.graphqlPath}`
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

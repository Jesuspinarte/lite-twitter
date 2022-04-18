import 'reflect-metadata';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import UserResolver from './resolvers/user';

const prisma = new PrismaClient();
// const typeDefs = gql`
//   type Query {
//     hello: String!
//   }
// `;
// const resolvers = {
//   Query: {
//     hello: () => 'mom!',
//   },
// };

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
  server.applyMiddleware({ app });

  app.listen(parseInt(process.env.PORT || '4000'), () => {
    console.log(
      `Server started on https://localhost:${process.env.PORT || 4000}${
        server.graphqlPath
      }`
    );
  });

  // const allUsers = await prisma.user.findMany({ include: { tweets: true } });
  // console.dir(allUsers, { depth: null });
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

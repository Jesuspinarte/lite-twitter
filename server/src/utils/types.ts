import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { PubSub } from 'graphql-subscriptions';

export type LTSession = Request & {
  session: {
    token: string;
  };
};

export interface LTContext {
  prisma: PrismaClient;
  pubsub: PubSub;
  req: LTSession;
  res: Response;
}

export interface UserTokenData {
  userId: string;
}

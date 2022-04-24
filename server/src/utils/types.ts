import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export type LTSession = Request & {
  session: {
    token: string;
  };
};

export interface LTContext {
  prisma: PrismaClient;
  req: LTSession;
  res: Response;
}

export interface UserTokenData {
  userId: string;
}

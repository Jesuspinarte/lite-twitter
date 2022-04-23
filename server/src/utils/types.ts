import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

interface LTSession {
  session: {
    token: string;
  };
}

export interface LTContext {
  prisma: PrismaClient;
  req: Request & LTSession;
  res: Response;
}

export interface UserTokenData {
  userId: string;
}

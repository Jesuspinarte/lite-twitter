import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface LTContext {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export interface UserTokenData {
  userId: string;
}

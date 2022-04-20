import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './constants';
import { UserTokenData } from './types';

export const getTokenPayload = (token: string): UserTokenData => {
  const userData = jwt.verify(token.replace('Baerer ', ''), SECRET_KEY);

  return userData as UserTokenData;
};

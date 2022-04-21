import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './constants';
import { UserTokenData } from './types';

export const getTokenPayload = (token: string): UserTokenData => {
  const userData = jwt.verify(token.replace('Baerer ', ''), SECRET_KEY);

  return userData as UserTokenData;
};

export const validateEmail = (email: string): boolean =>
  !!email.match(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

/**
 * [a-z]: At least one lowercase
 * [A-Z]: At least one uppercase
 * \d: At least one digit
 * \W|_: At least one special character
 * {6, 20}: From 6 to 20 characters
 */
export const validatePassword = (password: string): boolean =>
  !!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{6,20}$/);

export const validateUsername = (username: string): boolean =>
  !!username.match(/^[a-z0-9A-Z\._-]{6,16}$/);

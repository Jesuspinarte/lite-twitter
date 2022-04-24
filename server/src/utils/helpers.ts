import jwt from 'jsonwebtoken';
import { ValidatedUser } from 'src/entities/User';
import ErrorMessage from '../entities/ErrorMessage';
import UserInput, { UserInfo } from '../inputs/UserInput';
import { SECRET_KEY } from './constants';
import { LTSession, UserTokenData } from './types';

export const getTokenPayload = (token: string): UserTokenData => {
  const userData = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);

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

/**
 * Can han lowercase characters, uppercase characters, digits, ".", "-", "_" characters amd between 6 and 16 characters
 */
export const validateUsername = (username: string): boolean =>
  !!username.match(/^[a-z0-9A-Z\._-]{6,16}$/);

export const validateUserInput = (
  userInput: UserInput | UserInfo
): ErrorMessage[] => {
  let errors: ErrorMessage[] = [];

  if (!validateEmail(userInput.email)) {
    errors.push({
      field: 'email',
      message: 'The email structure is invalid.',
    });
  }

  if (!validateUsername(userInput.username)) {
    errors.push({
      field: 'username',
      message:
        'The username is invalid, only lower characters, upper characters, numbers and the "-", "_" and "." characters are allowed. The username has to have from 6 to 16 characters',
    });
  }

  if (userInput instanceof UserInput && !validatePassword(userInput.password)) {
    errors.push({
      field: 'password',
      message:
        'The password is invalid, it has to have 1 lower character, 1 upper character, 1 special character, 1 digit and has to be between 6 and 20 characters.',
    });
  }

  return errors;
};

export const catchUserErrors = (error: any): ErrorMessage[] => {
  let errors: ErrorMessage[] = [];

  if (error.meta.target.includes('email_1')) {
    errors.push({
      field: 'email',
      message: 'Email is registered',
    });
  } else if (error.meta.target.includes('username_1')) {
    errors.push({
      field: 'username',
      message: 'Username already taken',
    });
  } else {
    errors.push({
      type: error.name,
      message: error.message,
    });
  }

  return errors;
};

export const getAuthUser = (req: LTSession): ValidatedUser => {
  const errors: ErrorMessage[] = [];
  let userId;
  let token;

  if (!req) {
    errors.push({
      type: 'authorization',
      message: 'No authenticated user found.',
    });

    return { errors };
  }

  if (errors.length) {
    return { errors };
  }

  try {
    token = req.headers.authorization;

    if (!token) {
      errors.push({
        type: 'authorization',
        message: 'No authorization token found.',
      });

      return { errors };
    }

    userId = getTokenPayload(token).userId;
  } catch (error) {
    return { errors: catchUserErrors(error) };
  }

  return { token, userId };
};

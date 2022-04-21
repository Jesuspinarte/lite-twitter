import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import UserInput, { UserLoginInput } from '../inputs/UserInput';
import { SECRET_KEY } from '../utils/constants';
import { LTContext } from '../utils/types';
import {
  getTokenPayload,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/helpers';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('user') userInput: UserInput,
    @Ctx() { prisma }: LTContext
  ) {
    let errors = [];

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

    if (!validatePassword(userInput.password)) {
      errors.push({
        field: 'password',
        message:
          'The password is invalid, it has to have 1 lower character, 1 upper character, 1 special character, 1 digit and has to be between 6 and 20 characters.',
      });
    }

    if (errors.length) {
      return { errors };
    }

    const password = await bcrypt.hash(userInput.password, 10);
    let newUser;
    let token;

    try {
      newUser = await prisma.user.create({
        data: { ...userInput, password },
      });

      token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: '7d' });
    } catch (error) {
      if (error.meta.target === 'email_1') {
        errors.push({
          field: 'email',
          message: 'Email is registered',
        });
      }

      if (error.meta.target.includes('username_1')) {
        errors.push({
          field: 'username',
          message: 'Username already taken',
        });
      }
      return { errors };
    }

    return { token, user: newUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('user') userInput: UserLoginInput,
    @Ctx() { prisma }: LTContext
  ) {
    let user;
    let token;
    let errors = [];

    try {
      user = await prisma.user.findFirst({
        where: {
          username: {
            contains: userInput.username,
            mode: 'insensitive',
          },
        },
      });

      if (!user) {
        errors.push(
          {
            field: 'username',
            message: "User or password doesn't match.",
          },
          {
            field: 'password',
            message: "User or password doesn't match.",
          }
        );

        return { errors };
      }

      const valid = await bcrypt.compare(userInput.password, user.password);

      if (!valid) {
        errors.push(
          {
            field: 'username',
            message: "User or password doesn't match.",
          },
          {
            field: 'password',
            message: "User or password doesn't match.",
          }
        );

        return { errors };
      }

      token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });
    } catch (error) {
      errors.push({
        type: 'input',
        message: 'Error processing the information.',
      });

      return { errors };
    }

    return { token, user };
  }

  @Query(() => UserResponse)
  async currentUser(@Ctx() { prisma, req }: LTContext) {
    let user;
    let errors = [];

    if (!req) {
      errors.push({
        type: 'authorization',
        message: 'No authenticated user found.',
      });

      return { errors };
    }

    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const { userId } = getTokenPayload(authHeader);

        user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
          errors.push({
            type: 'session',
            message: 'No user was found in session.',
          });
        }
      }
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { user };
  }
}

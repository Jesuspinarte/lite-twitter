import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import UserInput, { UserInfo, UserLoginInput } from '../inputs/UserInput';
import { SECRET_KEY } from '../utils/constants';
import { LTContext } from '../utils/types';
import {
  catchUserErrors,
  getTokenPayload,
  validateUserInput,
} from '../utils/helpers';
import ErrorMessage from '../entities/ErrorMessage';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('user') userInput: UserInput,
    @Ctx() { prisma }: LTContext
  ) {
    let errors: ErrorMessage[] = [...validateUserInput(userInput)];

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
      return { errors: catchUserErrors(error) };
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

  @Mutation(() => UserResponse)
  async updateUserInfo(
    @Arg('user') userInfo: UserInfo,
    @Ctx() { prisma, req }: LTContext
  ) {
    let errors: ErrorMessage[] = [];
    if (!req) {
      errors.push({
        type: 'authorization',
        message: 'No authenticated user found.',
      });

      return { errors };
    }

    errors.push(...validateUserInput(userInfo));

    if (errors.length) {
      return { errors };
    }

    let user;

    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const { userId } = getTokenPayload(authHeader);

        user = await prisma.user.update({
          where: { id: userId },
          data: { ...userInfo },
        });

        if (!user) {
          errors.push({
            type: 'session',
            message: 'No user was found in session.',
          });

          return { errors };
        }
      }
    } catch (error) {
      return { errors: catchUserErrors(error) };
    }

    return { user };
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

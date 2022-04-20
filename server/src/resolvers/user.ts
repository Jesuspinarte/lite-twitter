import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import UserInput, { UserLoginInput } from '../inputs/UserInput';
import { LTContext } from '../utils/types';
import { getTokenPayload } from '../utils/helpers';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('user') userInput: UserInput,
    @Ctx() { prisma }: LTContext
  ) {
    const password = await bcrypt.hash(userInput.password, 10);
    let newUser;
    let token;
    let errors = [];

    try {
      newUser = await prisma.user.create({
        data: { ...userInput, password },
      });

      token = jwt.sign(
        { userId: newUser.id },
        process.env.SECRET_KEY || '53cr3t'
      );
    } catch (error) {
      if (error.meta.target === 'email_1') {
        errors.push({
          field: 'email',
          message: 'Email is registered',
        });
      }

      if (error.meta.target === 'username_1') {
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
      user = await prisma.user.findUnique({
        where: { username: userInput.username },
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

      token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY || '53cr3t');
    } catch (error) {
      console.log(error);
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

    return { user };
  }

  @Query(() => [User])
  async getAllUsers(@Ctx() { prisma }: LTContext) {
    let users = [];
    try {
      users = await prisma.user.findMany();
    } catch (error) {
      throw new Error(error);
    }

    return users;
  }
}

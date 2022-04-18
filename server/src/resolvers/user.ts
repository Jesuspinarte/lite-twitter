import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import { UserInput } from '../inputs/UserInput';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('user') userInput: UserInput,
    @Ctx() { prisma }: { prisma: PrismaClient }
  ) {
    const password = await bcrypt.hash(userInput.password, 10);
    let newUser;
    let token;

    try {
      newUser = await prisma.user.create({
        data: {
          ...userInput,
          password,
        },
      });

      token = jwt.sign(
        { userId: newUser.id },
        process.env.SECRET_KEY || '53cr3t'
      );
    } catch (error) {
      console.error(error.code, error);
      throw new Error(error);
    }

    return { token, user: newUser };
  }

  @Query(() => [User])
  async getAllUsers(@Ctx() { prisma }: { prisma: PrismaClient }) {
    let users = [];
    try {
      users = await prisma.user.findMany();
    } catch (error) {
      throw new Error(error);
    }

    return users;
  }
}

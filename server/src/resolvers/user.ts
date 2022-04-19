import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import UserInput, { UserLoginInput } from '../inputs/UserInput';

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
    @Ctx() { prisma }: { prisma: PrismaClient }
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
        field: 'fields',
        message: 'Invalid input',
      });

      return { errors };
    }

    return { token, user };
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

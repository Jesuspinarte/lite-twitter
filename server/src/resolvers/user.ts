import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserResponse } from '../entities/User';
import UserInput, {
  PasswordInput,
  UserInfo,
  UserLoginInput,
} from '../inputs/UserInput';
import { COOKIE_NAME, SECRET_KEY } from '../utils/constants';
import { LTContext } from '../utils/types';
import {
  catchUserErrors,
  getAuthUser,
  validatePassword,
  validateUserInput,
} from '../utils/helpers';
import ErrorMessage from '../entities/ErrorMessage';

@Resolver(User)
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('user') userInput: UserInput,
    @Ctx() { prisma, req }: LTContext
  ) {
    const errors: ErrorMessage[] = [...validateUserInput(userInput)];

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
      req.session.token = token;
    } catch (error) {
      return { errors: catchUserErrors(error) };
    }

    return { token, user: newUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('user') userInput: UserLoginInput,
    @Ctx() { prisma, req }: LTContext
  ) {
    const errors: ErrorMessage[] = [];
    let user;
    let token;

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
      req.session.token = token;
    } catch (error) {
      errors.push({
        type: 'input',
        message: 'Error processing the information.',
      });

      return { errors };
    }

    return { token, user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: LTContext) {
    return new Promise(resolve =>
      req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse)
  async updateUserInfo(
    @Arg('user') userInfo: UserInfo,
    @Ctx() { prisma, req }: LTContext
  ) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;

    if (errors.length) {
      return { errors };
    }

    try {
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
    } catch (error) {
      return { errors: catchUserErrors(error) };
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('password') passwordInput: PasswordInput,
    @Ctx() { prisma, req }: LTContext
  ) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;

    if (errors.length) {
      return { errors };
    }

    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        errors.push({
          type: 'session',
          message: 'No user was found in session.',
        });

        return { errors };
      }

      const valid = await bcrypt.compare(passwordInput.password, user.password);

      if (!valid) {
        errors.push({
          field: 'password',
          message: 'Wrong password.',
        });

        return { errors };
      }

      if (!validatePassword(passwordInput.newPassword)) {
        errors.push({
          field: 'newPassword',
          message:
            'The password is invalid, it has to have 1 lower character, 1 upper character, 1 special character, 1 digit and has to be between 6 and 20 characters.',
        });

        return { errors };
      }

      const newPassword = await bcrypt.hash(passwordInput.newPassword, 10);

      user = prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });

      if (!user) {
        errors.push({
          type: 'user',
          message: 'Unable to update user password.',
        });

        return { errors };
      }
    } catch (error) {
      return { errors: catchUserErrors(error) };
    }

    return { user };
  }

  @Query(() => UserResponse)
  async currentUser(@Ctx() { prisma, req }: LTContext) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;
    if (errors.length) {
      return { errors };
    }

    if (!req) {
      errors.push({
        type: 'authorization',
        message: 'No authenticated user found.',
      });

      return { errors };
    }

    try {
      user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        errors.push({
          type: 'session',
          message: 'No user was found in session.',
        });
        return { errors };
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

  @FieldResolver(() => [])
  async tweets(@Root() user: User, @Ctx() { prisma }: LTContext) {
    return (await prisma.tweet.findMany({ where: { userId: user.id } })) || [];
  }

  @FieldResolver(() => [])
  async votes(@Root() user: User, @Ctx() { prisma }: LTContext) {
    return (await prisma.vote.findMany({ where: { userId: user.id } })) || [];
  }
}

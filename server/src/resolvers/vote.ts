import Vote, { VoteResponse, VotesResponse } from '../entities/Vote';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { LTContext } from '../utils/types';
import { getAuthUser } from '../utils/helpers';
import ErrorMessage from '../entities/ErrorMessage';
import User from '../entities/User';

@Resolver(Vote)
export default class VoteResolver {
  @Mutation(() => VoteResponse)
  async vote(
    @Arg('tweetId') tweetId: string,
    @Ctx() { prisma, req }: LTContext
  ) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;
    let tweet;
    let vote;

    if (errors.length) {
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

      tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
      });

      if (!tweet) {
        errors.push({
          type: 'tweet',
          message: 'It was not possible to find the tweet.',
        });

        return { errors };
      }

      vote = await prisma.vote.create({
        data: {
          tweet: { connect: { id: tweetId } },
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { vote };
  }

  @Mutation(() => VoteResponse)
  async unvote(
    @Arg('tweetId') tweetId: string,
    @Ctx() { prisma, req }: LTContext
  ) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;
    let tweet;
    let vote;

    if (errors.length) {
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

      tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
      });

      if (!tweet) {
        errors.push({
          type: 'tweet',
          message: 'It was not possible to find the tweet.',
        });

        return { errors };
      }

      vote = await prisma.vote.delete({
        where: { tweetId_userId: { tweetId, userId: user.id } },
      });

      if (!vote) {
        errors.push({
          type: 'vote',
          message: 'There was an unexpected error deleting the vote.',
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

    return { vote };
  }

  @Query(() => VotesResponse)
  async userVotes(@Ctx() { prisma, req }: LTContext) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;
    let votes;

    if (errors.length) {
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

      votes = (await prisma.vote.findMany({ where: { userId } })) || [];
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { votes };
  }

  @FieldResolver(() => User)
  async user(@Root() vote: Vote, @Ctx() { prisma }: LTContext) {
    return await prisma.user.findUnique({ where: { id: vote.userId } });
  }

  @FieldResolver(() => User)
  async tweet(@Root() vote: Vote, @Ctx() { prisma }: LTContext) {
    return await prisma.tweet.findUnique({ where: { id: vote.tweetId } });
  }
}

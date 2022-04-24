import Tweet, { TweetResponse, TweetsResponse } from '../entities/Tweet';
import TweetInput, { TweetParams } from '../inputs/TweetInput';
import { LTContext } from '../utils/types';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { getAuthUser } from '../utils/helpers';
import ErrorMessage from '../entities/ErrorMessage';
import User from '../entities/User';

@Resolver(Tweet)
export default class TweetResolver {
  @Mutation(() => TweetResponse)
  async postTweet(
    @Arg('tweet') tweetInput: TweetInput,
    @Ctx() { prisma, req }: LTContext
  ) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let user;
    let tweet;

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

      tweet = await prisma.tweet.create({
        data: { text: tweetInput.text, user: { connect: { id: userId } } },
      });

      if (!tweet) {
        errors.push({
          type: 'tweet',
          message: 'There was an unexpected error creating the Tweet.',
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

    return { tweet };
  }

  @Query(() => TweetsResponse)
  async getAllTweets(
    @Ctx() { prisma }: LTContext,
    @Arg('params', { nullable: true }) _?: TweetParams
  ) {
    const tweets = await prisma.tweet.findMany();

    return { tweets };
  }

  @FieldResolver(() => User)
  async user(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return prisma.user.findUnique({ where: { id: tweet.userId } });
  }
}

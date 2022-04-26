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
import { getAuthUser, getTagsAndMentions } from '../utils/helpers';
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

      if (!tweetInput.text) {
        errors.push({
          field: 'text',
          message: "Tweet text can't be empty.",
        });

        return { errors };
      }

      const { hashtags, mentions } = getTagsAndMentions(tweetInput.text);

      tweet = await prisma.tweet.create({
        data: {
          text: tweetInput.text,
          hashtags,
          usernameMentions: mentions,
          user: { connect: { id: userId } },
          ...(tweetInput.tweetId && {
            tweet: { connect: { id: tweetInput.tweetId } },
          }),
        },
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

  @Mutation(() => TweetResponse)
  async deleteTweet(
    @Arg('id') tweetId: string,
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

      tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
      });

      if (!tweet || tweet.userId !== userId) {
        errors.push({
          type: 'tweet',
          message:
            'The current user is not the tweet owner or the tweet does not exist.',
        });

        return { errors };
      }

      tweet = await prisma.tweet.delete({
        where: { id: tweetId },
      });

      if (!tweet) {
        errors.push({
          type: 'tweet',
          message: 'There was an unexpected error deleting the tweet.',
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
  async feed(
    @Ctx() { prisma, req }: LTContext,
    @Arg('params', { nullable: true }) params?: TweetParams
  ) {
    const { errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    if (errors.length) {
      return { errors };
    }

    const page = params?.page ? params.page - 1 : 0;
    const perPage = params?.perPage || 10;
    const skip = page * perPage;

    const tweets = await prisma.tweet.findMany({ skip, take: perPage });

    return { tweets };
  }

  @FieldResolver(() => User)
  async user(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return await prisma.user.findUnique({ where: { id: tweet.userId } });
  }

  @FieldResolver(() => [])
  async mentions(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    const mentions = [];

    for (let username of tweet.usernameMentions) {
      const mention = await prisma.user.findFirst({
        where: { username: username },
      });

      if (mention) {
        mentions.push(mention);
      }
    }

    return mentions;
  }

  @FieldResolver(() => [])
  async comments(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.tweet.findMany({
        where: { tweetId: tweet.id },
      })) || []
    );
  }

  @FieldResolver(() => [])
  async commentsCount(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.tweet.count({
        where: { tweetId: tweet.id },
      })) || 0
    );
  }

  @FieldResolver(() => [])
  async votes(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.vote.findMany({
        where: { tweetId: tweet.id },
      })) || []
    );
  }

  @FieldResolver(() => [])
  async votesCount(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.vote.count({
        where: { tweetId: tweet.id },
      })) || 0
    );
  }
}

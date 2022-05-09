import Tweet, { CommentsResponse, TweetResponse, TweetsResponse, TweetSubscriptionResponse } from '../entities/Tweet';
import TweetInput, { TweetCommentsParams, TweetParams, UserTweetsParams } from '../inputs/TweetInput';
import { LTContext } from '../utils/types';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { getAuthUser, getTagsAndMentions } from '../utils/helpers';
import ErrorMessage from '../entities/ErrorMessage';
import User from '../entities/User';

@Resolver(Tweet)
export default class TweetResolver {
  @Mutation(() => TweetResponse)
  async postTweet(
    @Arg('tweet') tweetInput: TweetInput,
    @Ctx() { prisma, pubsub, req }: LTContext
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

    await pubsub.publish('FEED_NOTIFICATIONS', tweet);
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
    let nextSkip;
    let nextTake;
    let tweets;

    if (errors.length) {
      return { errors };
    }

    const skip = params?.skip || 0;
    const take = params?.take || 10;

    try {
      const tweetsCount = await prisma.tweet.count();

      nextSkip = skip + take;
      nextTake = tweetsCount > nextSkip ? take : null;

      tweets = await prisma.tweet.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }


    return { tweets, nextSkip, nextTake };
  }

  @Query(() => TweetsResponse)
  async tweets(
    @Ctx() { prisma, req }: LTContext,
    @Arg('ids', () => [String]) ids: [string]
  ) {
    const { errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    const tweets = [];

    if (errors.length) {
      return { errors };
    }

    try {
      for (let id of ids) {
        const tweet = await prisma.tweet.findUnique({ where: { id } });

        if (tweet) {
          tweets.push(tweet);
        }
      }
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { tweets };
  }

  @Query(() => TweetsResponse)
  async userTweets(
    @Ctx() { prisma, req }: LTContext,
    @Arg('params') params: UserTweetsParams
  ) {
    const { errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let nextSkip;
    let nextTake;
    let tweets;

    if (errors.length) {
      return { errors };
    }

    const skip = params.skip || 0;
    const take = params.take || 10;

    try {

      const user = await prisma.user.findFirst({
        where: {
          username: {
            contains: params.username, mode: 'insensitive'
          }
        }
      });

      if (!user) {
        errors.push({
          type: 'user',
          message: 'There was no user associated with the username.',
        });

        return { errors };
      }

      const tweetsCount = await prisma.tweet.count({
        where: {
          user: {
            username: {
              contains: params.username, mode: 'insensitive'
            }
          }
        }
      });
      nextSkip = skip + take;
      nextTake = tweetsCount > nextSkip ? take : null;

      tweets = await prisma.tweet.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        where: {
          user: {
            username: {
              contains: params.username, mode: 'insensitive'
            }
          }
        }
      });
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { tweets, nextSkip, nextTake };
  }

  @Query(() => CommentsResponse)
  async tweetComments(
    @Ctx() { prisma, req }: LTContext,
    @Arg('params') params: TweetCommentsParams
  ) {
    const { errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];
    let nextSkip;
    let nextTake;
    let comments;
    let tweet;

    if (errors.length) {
      return { errors };
    }

    const skip = params.skip || 0;
    const take = params.take || 10;

    try {
      tweet = await prisma.tweet.findUnique({
        where: { id: params.tweetId }
      });

      if (!tweet) {
        errors.push({
          type: 'tweet',
          message: 'The tweet was not found. It has never existed or it was deleted.',
        });

        return { errors };
      }

      const tweetsCount = await prisma.tweet.count({ where: { tweetId: params.tweetId } });
      nextSkip = skip + take;
      nextTake = tweetsCount > nextSkip ? take : null;

      comments = await prisma.tweet.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        where: { tweetId: params.tweetId }
      });
    } catch (error) {
      errors.push({
        type: error.name,
        message: error.message,
      });

      return { errors };
    }

    return { tweet, comments, nextSkip, nextTake };
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

  @FieldResolver(() => (Tweet || null))
  async tweet(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    if (!tweet.tweetId) {
      return null;
    }

    return (
      (await prisma.tweet.findUnique({
        where: { id: tweet.tweetId },
      })) || null
    );
  }

  @FieldResolver(() => [])
  async comments(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.tweet.findMany({
        where: { tweetId: tweet.id },
      })) || []
    );
  }

  @FieldResolver()
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

  @FieldResolver()
  async votesCount(@Root() tweet: Tweet, @Ctx() { prisma }: LTContext) {
    return (
      (await prisma.vote.count({
        where: { tweetId: tweet.id },
      })) || 0
    );
  }

  @FieldResolver(() => [])
  async hasVote(@Root() tweet: Tweet, @Ctx() { prisma, req }: LTContext) {
    const { userId, errors: newErrors } = getAuthUser(req);
    const errors: ErrorMessage[] = [...(newErrors || [])];

    if (errors.length) {
      return { errors };
    }

    const vote = await prisma.vote.findFirst({
      where: { tweetId: tweet.id, userId },
    });

    return vote ? true : false;
  }

  // ------------------------------------------------------ SUBSCIPTIONS ------------------------------------------------------
  @Subscription(() => TweetSubscriptionResponse, { topics: 'FEED_NOTIFICATIONS' })
  // async feedNotifications(@Root() tweet: Tweet, @Arg('token') token: string) {
  async feedNotifications(@Root() tweet: Tweet) {
    // const { errors: newErrors } = getAuthUser(token);
    // const errors: ErrorMessage[] = [...(newErrors || [])];

    // if (errors.length) {
    //   return { errors };
    // }
    return {
      tweetId: tweet.id,
      userId: tweet.userId
    };
  }
}

import { Field, ObjectType } from 'type-graphql';
import ErrorMessage from './ErrorMessage';

import User from './User';
import Vote from './Vote';

@ObjectType()
export default class Tweet {
  userId: string; // Not mapped with @Field to hide this property on the response.
  tweetId: string; // Not mapped with @Field to hide this property on the response.
  usernameMentions: string[]; // Not mapped with @Field to hide this property on the response.

  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  text: string;

  @Field(() => [String])
  hashtags: string;

  @Field(() => User)
  user: User;

  @Field(() => [Vote])
  votes: Vote[];

  @Field(() => Tweet, { nullable: true })
  tweet: Tweet;

  @Field(() => [Tweet])
  comments: Tweet[];

  @Field(() => [User])
  mentions: User[];

  @Field()
  votesCount: number;

  @Field()
  commentsCount: number;

  @Field()
  hasVote: boolean;
}

@ObjectType()
export class TweetsResponse {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field(() => [Tweet], { nullable: true })
  tweets?: Tweet[];
}

@ObjectType()
export class TweetResponse {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field(() => Tweet, { nullable: true })
  tweet?: Tweet;
}

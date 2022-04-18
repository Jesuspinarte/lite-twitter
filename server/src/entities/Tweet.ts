import { Field, ObjectType } from 'type-graphql';

import User from './User';
import Vote from './Vote';

@ObjectType()
export default class Tweet {
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
}

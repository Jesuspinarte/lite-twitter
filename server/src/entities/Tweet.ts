import { Field, ObjectType } from 'type-graphql';
import Comment from './Comment';
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
  hashtags: string[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Vote])
  votes: Vote[];

  @Field(() => User)
  user: User;
}

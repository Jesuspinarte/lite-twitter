import { Field, ObjectType } from 'type-graphql';
import Tweet from './Tweet';
import User from './User';

@ObjectType()
export default class Vote {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => Tweet)
  tweet: Tweet;

  @Field(() => User)
  user: User;
}

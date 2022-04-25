import { Field, ObjectType } from 'type-graphql';
import ErrorMessage from './ErrorMessage';
import Tweet from './Tweet';
import User from './User';

@ObjectType()
export default class Vote {
  userId: string;
  tweetId: string;

  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => Tweet)
  tweet: Tweet;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class VoteResponse {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field(() => Vote, { nullable: true })
  vote?: Vote;
}

@ObjectType()
export class VotesResponse {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field(() => [Vote], { nullable: true })
  votes?: Vote[];
}

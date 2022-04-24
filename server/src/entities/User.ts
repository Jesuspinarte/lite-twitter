import { Field, ObjectType } from 'type-graphql';

import ErrorMessage from './ErrorMessage';
import Tweet from './Tweet';
import Vote from './Vote';

@ObjectType()
export default class User {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  name: string;

  @Field(() => [Tweet])
  tweets: Tweet[];

  @Field(() => [Vote])
  votes: Vote[];
}

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field({ nullable: true })
  token?: string;

  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
export class ValidatedUser {
  @Field(() => [ErrorMessage], { nullable: true })
  errors?: ErrorMessage[];

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  userId?: string;
}

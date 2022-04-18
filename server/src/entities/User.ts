import { Field, ObjectType } from 'type-graphql';

import Comment from './Comment';
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

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Vote])
  votes: Vote[];
}

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorMessage])
  errors?: ErrorMessage[];

  @Field()
  token: string;

  @Field(() => User)
  user?: User;
}

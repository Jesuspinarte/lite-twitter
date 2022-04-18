import { ObjectType, Field } from 'type-graphql';
import Tweet from './Tweet';
import Comment from './Comment';
import Vote from './Vote';
import ErrorResponse from './ErrorResponse';

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

  @Field({ nullable: true })
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
  @Field(() => [ErrorResponse])
  errors?: ErrorResponse[];

  @Field(() => User)
  user?: User;

  @Field()
  token?: string;
}

import { Field, InputType } from 'type-graphql';

@InputType()
export default class TweetInput {
  @Field()
  text: string;

  @Field({ nullable: true })
  tweetId?: string;
}

@InputType()
export class TweetParams {
  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}

@InputType()
export class UserTweetsParams {
  @Field()
  userId: string;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}

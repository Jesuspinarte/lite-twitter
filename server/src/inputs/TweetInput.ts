import { Field, InputType } from 'type-graphql';

@InputType()
export default class TweetInput {
  @Field()
  text: string;
}

@InputType()
export class TweetParams {
  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  perPage?: number;
}

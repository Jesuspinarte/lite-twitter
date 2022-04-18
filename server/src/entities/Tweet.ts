import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Tweet {
  @Field()
  id: string;
}

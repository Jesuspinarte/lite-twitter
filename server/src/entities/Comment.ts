import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Comment {
  @Field()
  id: string;
}

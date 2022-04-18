import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Vote {
  @Field()
  id: string;
}

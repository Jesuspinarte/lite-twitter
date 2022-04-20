import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ErrorMessage {
  @Field()
  field?: string;

  @Field()
  type?: string;

  @Field()
  message: string;
}

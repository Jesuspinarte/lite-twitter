import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ErrorMessage {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  type?: string;

  @Field()
  message: string;
}

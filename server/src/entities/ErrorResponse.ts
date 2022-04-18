import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class ErrorResponse {
  @Field()
  field: string;

  @Field()
  message: string;
}

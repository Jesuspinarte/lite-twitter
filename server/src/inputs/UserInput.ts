import { Field, InputType } from "type-graphql";

@InputType()
export default class UserInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  password: string;
}
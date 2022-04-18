import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  email: string;

  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  name: string;
}

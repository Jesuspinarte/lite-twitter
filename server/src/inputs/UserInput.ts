import { Field, InputType } from 'type-graphql';

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

@InputType()
export class UserLoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class UserInfo {
  @Field({ nullable: true })
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  name: string;
}

@InputType()
export class PasswordInput {
  @Field()
  password: string;

  @Field()
  newPassword: string;
}

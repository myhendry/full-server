import { AuthenticationError } from "apollo-server-express";
import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { hash, compare } from "bcryptjs";

import { createAccessToken } from "../../utils/auth";
import { User } from "../../entity/User";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    const users = await User.find();
    return users;
  }

  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") emailInput: string,
    @Arg("password") passwordInput: string
  ): Promise<string | null> {
    const user = await User.findOne({ where: { email: emailInput } });

    if (!user) {
      throw new AuthenticationError("Invalid Login");
    }

    const valid = await compare(passwordInput, user.password);

    if (!valid) {
      throw new AuthenticationError("Invalid Login");
    }

    return createAccessToken(user);
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const emailExist = await User.findOne({ where: { email } });

    if (emailExist) {
      throw new AuthenticationError("Email Already in Use");
    }

    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}

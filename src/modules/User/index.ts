import { AuthenticationError } from "apollo-server-express";
import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { getRepository } from "typeorm";

import { createAccessToken } from "../../utils/auth";
import { User } from "../../entity/User";
import { Profile } from "../../entity/Profile";
import { authenticateFacebook } from "../../utils/passport";
import { ContextType } from "./../../types/ContextType";
import { isAuth } from "./../Middlewares/isAuth";
import { Gender } from "./gender-type";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    const users = await User.find();
    return users;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUserProfile(
    @Ctx() { payload }: ContextType
  ): Promise<User | undefined> {
    const userProfile = await getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.profile", "profile")
      .where("users.id = :userId", { userId: payload?.userId })
      .getOne();
    return userProfile;
  }

  @Mutation(() => Profile, { nullable: true })
  @UseMiddleware(isAuth)
  async createProfile(
    @Arg("gender", () => Gender) gender: Gender,
    @Arg("photo") photo: string,
    @Ctx() { payload }: ContextType
  ): Promise<Profile | null> {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (!user) {
      return null;
    }

    const profile = new Profile();
    profile.gender = gender;
    profile.photo = photo;
    profile.user = user;
    await profile.save();

    user.profile = profile;
    await user.save();
    return profile;
  }

  //Todo Upsert
  @Mutation(() => String, { nullable: true })
  async authFacebook(
    @Arg("facebookAccessToken") facebookAccessToken: string,
    @Ctx() { req, res }: ContextType
  ): Promise<string | null> {
    req.body = {
      ...req.body,
      access_token: facebookAccessToken,
    };

    try {
      const { data, info }: any = await authenticateFacebook(req, res);

      console.log("data", data);
      console.log("info", info);
      const { profile } = data;
      console.log(profile.emails);
      // await customUpsert(User, data)
      if (data) {
        const user = User.findOne({ where: { facebookId: profile.id } });

        //todo if no user, add user
        if (!user) {
        }

        //todo if user exists, convert to JWT and return user info
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
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
    // const emailExist = await User.findOne({ where: { email } });

    // if (emailExist) {
    //   throw new AuthenticationError("Email Already in Use");
    // }

    const hashedPassword = await hash(password, 12);

    try {
      await User.create({
        email,
        password: hashedPassword,
      }).save();
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}

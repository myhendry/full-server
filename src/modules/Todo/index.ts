import {
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
  Ctx,
  Arg,
} from "type-graphql";

import { ContextType } from "./../../types/ContextType";
import { isAuth } from "./../Middlewares/isAuth";
import { Todo } from "../../entity/Todo";
import { User } from "../../entity/User";

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  @UseMiddleware(isAuth)
  async todos() {
    const todos = await Todo.find();
    return todos;
  }

  @Mutation(() => Todo, { nullable: true })
  @UseMiddleware(isAuth)
  async addTodo(
    @Arg("name") name: string,
    @Ctx() { payload }: ContextType
  ): Promise<Todo | null> {
    try {
      const user = await User.findOne({ where: { id: payload?.id } });
      const todo = await Todo.create({
        name,
        user,
      }).save();
      return todo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

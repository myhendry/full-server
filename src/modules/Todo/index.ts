import { getRepository } from "typeorm";
import {
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
  Ctx,
  Arg,
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
  FieldResolver,
} from "type-graphql";

import { ContextType } from "./../../types/ContextType";
import { isAuth } from "./../middlewares/isAuth";
import { Todo } from "../../entity/Todo";
import { User } from "../../entity/User";

const ADDED_TODO = "added_todo";

@Resolver(() => Todo)
export class TodoResolver {
  @Subscription({
    topics: ADDED_TODO,
  })
  addedTodo(@Root() todoPayload: Todo): Todo {
    return todoPayload;
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async testQueryBuilder(
    @Ctx() { payload }: ContextType
  ): Promise<boolean | null> {
    const list = await getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.todos", "todo")
      .where("users.id = :userId", { userId: payload?.userId })
      .getOne();
    console.log("list", list);

    const todos = await getRepository(Todo)
      .createQueryBuilder("todo")
      .orderBy("todo.name", "DESC")
      .where("todo.userId = :userId", { userId: payload?.userId })
      .getMany();
    console.log(todos);

    const sql = await getRepository(Todo)
      .createQueryBuilder("todo")
      .orderBy("todo.name", "DESC")
      .where("todo.userId = :userId", { userId: payload?.userId })
      .getSql();
    console.log("sql", sql);
    return true;
  }

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
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: ContextType
  ): Promise<Todo | null> {
    try {
      const user = await User.findOne({ where: { id: payload?.userId } });
      const todo = await Todo.create({
        name,
        user,
      }).save();
      await pubSub.publish(ADDED_TODO, todo);
      return todo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async user(@Root() todo: Todo) {
    const user = await User.findOne({ where: { id: todo.userId } });
    return user;
  }
}

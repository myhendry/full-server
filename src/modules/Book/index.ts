import {
  Resolver,
  Mutation,
  UseMiddleware,
  Arg,
  ID,
  Query,
  Ctx,
} from "type-graphql";

import { isAuth } from "./../middlewares/isAuth";
import { Book } from "../../entity/Book";
import { User } from "../../entity/User";
import { getManager } from "typeorm";
import { ContextType } from "src/types/ContextType";

@Resolver(() => Book)
export class BookResolver {
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async books() {
    const books = await Book.find();
    return books;
  }

  //todo
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async likeBook(
    @Arg("bookId") bookId: string,
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    const book = await Book.findOne({ where: { id: bookId } });

    if (!book) {
      return false;
    }

    const like = await getManager()
      .createQueryBuilder(Book, "book")
      .where("book.id = :bookId", { bookId: bookId })
      .andWhere("book.likes @> ARRAY[:userId]", { userId: payload?.userId })
      .getOne();

    console.log("list ", like);

    if (!like) {
      book.likes.push(payload?.userId!);
      book.save();
    }

    return true;
  }

  @Mutation(() => Book, { nullable: true })
  @UseMiddleware(isAuth)
  async addBook(
    @Arg("title") title: string,
    @Arg("authorIds", () => [ID]) _authorIds: User[]
  ): Promise<Book | null> {
    try {
      const book = new Book();
      book.title = title;
      await book.save();
      return book;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

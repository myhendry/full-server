import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Todo } from "./Todo";
import { Profile } from "./Profile";
import { Book } from "./Book";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  facebookId?: string;

  @Field()
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated: Date;

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, { nullable: true })
  @JoinColumn()
  profile: Profile;

  @Field(() => [Todo])
  @OneToMany(() => Todo, (todo) => todo.user, {
    onDelete: "CASCADE",
  })
  todos: Todo[];

  @Field(() => [Book], { nullable: true })
  @ManyToMany(() => Book, (book) => book.users)
  books: Book[];
}

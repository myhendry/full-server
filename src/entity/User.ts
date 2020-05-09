import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Todo } from "./Todo";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated: Date;

  @Field(() => [Todo])
  @OneToMany(() => Todo, (todo) => todo.user, {
    onDelete: "CASCADE",
  })
  todos: Todo[];
}

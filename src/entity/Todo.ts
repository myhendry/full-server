import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity("todo")
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: "userId" })
  user: User;
}

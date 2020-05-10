import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity("book")
export class Book extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar", length: 255 })
  title: string;

  //! Denotes empty array. can use array enum too for typeorm v0.2.12
  //! https://github.com/typeorm/typeorm/issues/1532
  @Field(() => [ID])
  @Column("text", { array: true, default: "{}" })
  likes: string[];

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated: Date;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.books)
  @JoinTable()
  users: User[];
}

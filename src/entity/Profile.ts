import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Gender } from "../modules/User/gender-type";
import { User } from "./User";

@ObjectType()
@Entity("profile")
export class Profile extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Gender, { nullable: true })
  @Column("enum", { name: "gender", enum: Gender, nullable: true })
  gender?: Gender;

  @Field()
  @Column({ type: "varchar", length: 255 })
  photo: string;

  @Column("text")
  userId: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  @JoinColumn({ name: "userId" })
  user: User;
}

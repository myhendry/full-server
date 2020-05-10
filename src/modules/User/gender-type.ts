import { registerEnumType } from "type-graphql";

export enum Gender {
  MALE,
  FEMALE,
}

registerEnumType(Gender, {
  name: "Gender",
  description: "Gender",
});

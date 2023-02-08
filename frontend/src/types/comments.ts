import { UserProps } from "./user";

export interface Comments {
  text: string;
  _id: number;
  postedBy: UserProps;
}

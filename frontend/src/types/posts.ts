import { Comments } from "./comments";
import { UserProps } from "./user";

interface PostsProps {
  photo: string;
  _id: number;
  hashtags: string[];
  category: string;
  likes?: string[];
  comments?: Comments[];
  postedBy: UserProps;
  desc: string;
  createdAt: Date;
}

export default PostsProps;

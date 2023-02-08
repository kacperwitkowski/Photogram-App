import { Friends } from "./message";

export interface NotificationTypes {
  _id: string;
  postId: string;
  notifType: number;
  postedBy: Friends;
  selectedConv: {
    _id: string;
    users: Friends[];
  };
}

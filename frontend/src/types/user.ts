import { NotificationTypes } from "./notifications";

interface waitingToAcceptUsers {
  _id: string;
  postedBy: {
    _id: string;
    name: string;
    photoUrl: string;
  };
}

export interface UserProps {
  _id: string;
  name: string;
  email: string;
  photoUrl: string;
  hobbies: string[];
  desc: string;
  savedPosts: string[];
  privateAccount: boolean;
  notifications: NotificationTypes[];
  waitingToAcceptUsers?: waitingToAcceptUsers[];
  whoIFollow: string[];
  whoIsFollowingMe: string[];
}

export interface WaitingToAcceptUsers {
  postedBy: {
    _id: string;
    photoUrl: string;
    name: string;
  };
}

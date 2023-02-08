export interface Conversation {
  _id: string;
  users: Friends[];
}
export interface Message {
  _id: string;
  conversation: Conversation;
  sender: {
    name: string;
    email: string;
    photoUrl: string;
    _id: string;
  };
  createdAt: Date;
  read: boolean;
  content: string;
}
export interface OnlineUsers {
  userId: string;
  socketId: string;
}
export interface Friends {
  _id: string;
  photoUrl: string;
  name: string;
  privateAccount?: boolean;
}

export interface singleMessage {
  message: Message;
  own: boolean;
}

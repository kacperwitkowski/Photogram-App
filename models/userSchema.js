import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/17/17004.png",
  },
  hobbies: {
    type: [String],
  },
  desc: {
    type: String,
  },
  savedPosts: [String],
  whoIsFollowingMe: {
    type: [String],
  },
  privateAccount: {
    type: Boolean,
    default: false,
  },
  waitingToAcceptUsers: [
    {
      test: { type: Boolean, required: false },
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
  whoIFollow: {
    type: [String],
  },
  notifications: [
    {
      postId: { type: String, required: false },
      selectedConv: { type: Object, required: false },
      notifType: Number,
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
});

export default mongoose.model("User", User);

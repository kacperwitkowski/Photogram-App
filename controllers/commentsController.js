import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

export const postComment = async (req, res, next) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user,
    };

    const result = await Post.findByIdAndUpdate(
      req.params.postID,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("postedBy", "_id name photoUrl")
      .populate("comments.postedBy", "_id name photoUrl");

    if (req.user._id !== result.postedBy._id.toString()) {
      await User.findByIdAndUpdate(
        result.postedBy._id,
        {
          $push: {
            notifications: {
              notifType: 2,
              postId: req.params.postID,
              postedBy: mongoose.Types.ObjectId(req.user._id),
            },
          },
        },
        { new: true }
      ).populate("notifications.postedBy", "_id name photoUrl");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const findComment = await Post.findByIdAndUpdate(
      req.params.postID,
      {
        $pull: { comments: { _id: req.body.commentID } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name photoUrl")
      .populate("comments.postedBy", "_id name photoUrl");

    res.status(200).json(findComment);
  } catch (err) {
    next(err);
  }
};

import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

export const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      ...req.body,
      postedBy: req.user,
    });

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const fetchPostsByTopic = await Post.find()
      .populate("postedBy", "_id name  photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl")
      .limit(20)
      .sort({ createdAt: -1 });

    const filterPosts = fetchPostsByTopic.filter(
      (el) => !el.postedBy.privateAccount
    );

    res.status(200).json(filterPosts);
  } catch (err) {
    next(err);
  }
};

export const getByTopic = async (req, res, next) => {
  try {
    const fetchPostsByTopic = await Post.find({ category: req.params.topic })
      .populate("postedBy", "_id name  photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl")
      .limit(20)
      .sort({ createdAt: -1 });

    const filterPosts = fetchPostsByTopic.filter(
      (el) =>
        !el.postedBy.privateAccount ||
        req.user._id === el.postedBy._id.toString()
    );

    res.status(200).json(filterPosts);
  } catch (err) {
    next(err);
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    const findSinglePost = await Post.findOne({
      _id: req.params.id,
    })
      .populate("postedBy", "_id name photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl");

    res.status(200).json(findSinglePost);
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userPosts = await Post.find({ postedBy: req.user })
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });

    res.status(200).json(userPosts);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postID);

    res.status(200).json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
};
export const getUserFollowsPosts = async (req, res, next) => {
  try {
    res.status(200).json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const searchUser = async (req, res, next) => {
  const query = req.query.q;

  try {
    const userFind = await User.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);

    res.status(200).json(userFind);
  } catch (err) {
    next(err);
  }
};
export const searchByHashtag = async (req, res, next) => {
  const query = req.query.q;

  try {
    const hashFind = await Post.find({
      hashtags: { $regex: query, $options: "i" },
    })
      .populate("postedBy", "_id name photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl")
      .limit(20);

    const filterPosts = hashFind.filter((el) => !el.postedBy.privateAccount);

    res.status(200).json(filterPosts);
  } catch (err) {
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const saveLike = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
      .populate("postedBy", "_id name photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl");

    if (req.user._id !== saveLike.postedBy._id.toString()) {
      await User.findByIdAndUpdate(
        saveLike.postedBy._id,
        {
          $push: {
            notifications: {
              notifType: 1,
              postId: req.params.id,
              postedBy: mongoose.Types.ObjectId(req.user._id),
            },
          },
        },
        { new: true }
      ).populate("notifications.postedBy", "_id name photoUrl");
    }

    res.status(200).json(saveLike);
  } catch (err) {
    next(err);
  }
};

export const dislikePost = async (req, res, next) => {
  try {
    const saveLike = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
      .populate("postedBy", "_id name photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl");
    res.status(200).json(saveLike);
  } catch (err) {
    next(err);
  }
};

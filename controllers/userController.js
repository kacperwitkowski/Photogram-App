import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

export const getUserPosts = async (req, res, next) => {
  try {
    const data = await Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name photoUrl privateAccount")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const data = await User.find({ _id: req.params.id })
      .populate("notifications.postedBy", "_id name photoUrl")
      .populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");

    const { password, email, ...others } = data[0]._doc;

    res.status(200).json([others]);
  } catch (err) {
    next(err);
  }
};
export const getOtherUserProfile = async (req, res, next) => {
  try {
    const data = await User.find({ _id: req.params.id })
      .populate("notifications.postedBy", "_id name photoUrl")
      .populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");

    const { password, email, notifications, savedPosts, ...others } =
      data[0]._doc;

    res.status(200).json([others]);
  } catch (err) {
    next(err);
  }
};

export const saveUserSavedPosts = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { savedPosts: req.params.id },
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
export const unsaveUserSavedPosts = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { savedPosts: req.params.id },
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getUserSavedPosts = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.user._id });

    const data = await Post.findById(req.params.id).populate(
      "postedBy",
      "_id privateAccount"
    );

    if (
      !data.postedBy.privateAccount ||
      user[0]?.whoIFollow?.includes(data.postedBy._id) ||
      req.user._id === data.postedBy._id.toString()
    ) {
      res.status(200).json(data);
    } else res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const followPrivAccount = async (req, res, next) => {
  try {
    const followPrivAccount = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          waitingToAcceptUsers: {
            postedBy: req.user._id,
          },
        },
      },
      { new: true }
    ).populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");

    res.status(200).json(followPrivAccount);
  } catch (err) {
    next(err);
  }
};

export const unfollowPrivAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { waitingToAcceptUsers: { postedBy: { _id: req.user._id } } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { whoIFollow: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { whoIsFollowingMe: req.user._id },
    });

    res.status(200).json({ msg: "Unsend request" });
  } catch (err) {
    next(err);
  }
};

export const approveFollow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { waitingToAcceptUsers: { postedBy: { _id: req.params.id } } },
    });

    await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { whoIFollow: req.user._id },
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { whoIsFollowingMe: req.params.id },
      },
      { new: true }
    )
      .populate("notifications.postedBy", "_id name photoUrl")
      .populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const declineFollow = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { waitingToAcceptUsers: { postedBy: { _id: req.params.id } } },
      },
      { new: true }
    )
      .populate("notifications.postedBy", "_id name photoUrl")
      .populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const followUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { whoIFollow: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { whoIsFollowingMe: req.user._id },
    });

    res.status(200).json({ msg: "Followed user" });
  } catch (err) {
    next(err);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { whoIFollow: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { whoIsFollowingMe: req.user._id },
    });

    res.status(200).json({ msg: "Deleted sub" });
  } catch (err) {
    next(err);
  }
};

export const makeAccPrivate = async (req, res, next) => {
  try {
    const setAccPrivate = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { privateAccount: req.body.privateAccount },
      },
      { new: true }
    );

    res.status(200).json(setAccPrivate);
  } catch (err) {
    next(err);
  }
};

export const getFollowedUsersPosts = async (req, res, next) => {
  try {
    const data = await Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name photoUrl privateAccount")
      .populate("comments.postedBy", "_id name photoUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createUserBio = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { desc: req.body.desc },
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createUserHobbies = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { hobbies: req.body.hobbies },
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const updatePhoto = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { photoUrl: req.body.photoUrl },
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateUserName = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name },
      { new: true }
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const findNotification = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { notifications: { _id: req.params.id } },
      },
      { new: true }
    )
      .populate("notifications.postedBy", "_id name photoUrl")
      .populate("waitingToAcceptUsers.postedBy", "_id name photoUrl");

    res.status(200).json(findNotification);
  } catch (err) {
    next(err);
  }
};

export const getUserOnlineFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const friends = await Promise.all(
      user.whoIFollow.map((friendId) => {
        return User.findById(friendId);
      })
    );

    let friendList = [];

    friends.map((friend) => {
      const { _id, name, photoUrl } = friend;
      friendList.push({ _id, name, photoUrl });
    });
    res.status(200).json(friendList);
  } catch (err) {
    next(err);
  }
};

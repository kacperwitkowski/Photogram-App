import express from "express";
import {
  getUserPosts,
  getUserSavedPosts,
  saveUserSavedPosts,
  unsaveUserSavedPosts,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowedUsersPosts,
  createUserBio,
  createUserHobbies,
  updatePhoto,
  makeAccPrivate,
  followPrivAccount,
  approveFollow,
  declineFollow,
  unfollowPrivAccount,
  updateUserName,
  deleteNotification,
  getUserOnlineFriends,
  getOtherUserProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/myfollowed/:id", verifyToken, getFollowedUsersPosts);

router.get("/:id", getUserPosts);

router.get("/profile/:id", getUserProfile);

router.get("/userprofile/:id", getOtherUserProfile);

router.put("/updateUser", verifyToken, updateUserName);

router.put("/saved/:id", verifyToken, saveUserSavedPosts);

router.put("/unsaved/:id", verifyToken, unsaveUserSavedPosts);

router.put("/follow/:id", verifyToken, followUser);

router.put("/unfollow/:id", verifyToken, unfollowUser);

router.put("/createbio", verifyToken, createUserBio);

router.put("/createhobbies", verifyToken, createUserHobbies);

router.put("/updatephoto", verifyToken, updatePhoto);

router.put("/accountprivate", verifyToken, makeAccPrivate);

router.put("/followprivate/:id", verifyToken, followPrivAccount);

router.put("/unfollowprivate/:id", verifyToken, unfollowPrivAccount);

router.put("/approvefollow/:id", verifyToken, approveFollow);

router.put("/declinefollow/:id", verifyToken, declineFollow);

router.get("/saved/:id", verifyToken, getUserSavedPosts);

router.put("/deleteNotification/:id", verifyToken, deleteNotification);

router.get("/onlineFriends/:id", getUserOnlineFriends);

export default router;

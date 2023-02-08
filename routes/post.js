import express from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getByTopic,
  getSinglePost,
  getUserFollowsPosts,
  getUserPosts,
  likePost,
  searchByHashtag,
  searchUser,
} from "../controllers/postController.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createPost);

router.get("/all", getAllPosts);

router.get("/", getUserFollowsPosts);

router.get("/myposts", verifyToken, getUserPosts);

router.get("/bytopic/:topic", verifyToken, getByTopic);

router.get("/getpost/:id", getSinglePost);

router.put("/like/:id", verifyToken, likePost);

router.put("/dislike/:id", verifyToken, dislikePost);

router.get("/search/hash", searchByHashtag);

router.get("/search/users", searchUser);

router.delete("/:postID", verifyToken, deletePost);

export default router;

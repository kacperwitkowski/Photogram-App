import express from "express";
import {
  deleteComment,
  postComment,
} from "../controllers/commentsController.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.put("/:postID", verifyToken, postComment);

router.put("/delete/:postID", verifyToken, deleteComment);

export default router;

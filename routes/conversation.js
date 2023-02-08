import express from "express";
import {
  fetchConversations,
  newConversation,
} from "../controllers/conversationController.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, newConversation);

router.get("/", verifyToken, fetchConversations);

export default router;

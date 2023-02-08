import express from "express";
import {
  createMessageNotification,
  fetchLastMessage,
  getAllMessages,
  newMessage,
  updateReadMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, newMessage);

router.get("/:convId", verifyToken, getAllMessages);

router.get("/singleMessage/:messageId", fetchLastMessage);

router.put("/:messageId", updateReadMessage);

router.put("/sendNotification/:receiverId", verifyToken, createMessageNotification);

export default router;

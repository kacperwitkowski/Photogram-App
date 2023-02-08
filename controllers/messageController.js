import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";
import mongoose from "mongoose";

export const newMessage = async (req, res, next) => {
  const { content, convId } = req.body;

  if (!content || !convId) return res.status(400).json({ msg: "Invalid data" });

  let newMessage = {
    sender: req.user._id,
    content,
    conversation: convId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name photoUrl _id");
    message = await message.populate("conversation");
    message = await User.populate(message, {
      path: "conversation.users",
      select: "name photoUrl email",
    });

    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const getMessages = await Message.find({
      conversation: req.params.convId,
    })
      .populate("sender", "name photoUrl email")
      .populate("conversation");

    res.json(getMessages);
  } catch (err) {
    next(err);
  }
};

export const updateReadMessage = async (req, res, next) => {
  try {
    const updateMessage = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    ).populate("sender", "_id name photoUrl");

    res.status(200).json(updateMessage);
  } catch (err) {
    next(err);
  }
};

export const createMessageNotification = async (req, res, next) => {
  try {
    const findReceiver = await User.find({
      _id: req.params.receiverId,
    });

    const receiverNotifications = findReceiver[0].notifications.filter(
      (notification) =>
        notification.selectedConv._id === req.body.selectedConv._id
    );

    if (receiverNotifications.length === 0) {
      const sendingMessageNotif = await User.findByIdAndUpdate(
        req.params.receiverId,
        {
          $push: {
            notifications: {
              notifType: 3,
              selectedConv: req.body.selectedConv,
              postedBy: mongoose.Types.ObjectId(req.body.senderId),
            },
          },
        },
        { new: true }
      ).populate("notifications.postedBy", "_id name photoUrl");
      res.status(200).json(sendingMessageNotif);
    }
  } catch (err) {
    next(err);
  }
};

export const fetchLastMessage = async (req, res, next) => {
  try {
    const fetchLastMessage = await Message.findById(req.params.messageId)
      .populate("sender", "name photoUrl email")
      .populate("conversation");

    res.json(fetchLastMessage);
  } catch (err) {
    next(err);
  }
};

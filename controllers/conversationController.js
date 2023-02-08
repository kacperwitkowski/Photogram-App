import Conversation from "../models/conversationSchema.js";
import User from "../models/userSchema.js";

export const newConversation = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: " UserId param not sent with request" });
  }

  var isConv = await Conversation.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("users", "_id name photoUrl");

  if (isConv.length > 0) {
    res.send(isConv[0]);
  } else {
    var chatData = {
      users: [req.user._id, userId],
    };

    try {
      const createNewConv = await Conversation.create(chatData);
      const fullConv = await Conversation.findOne({
        _id: createNewConv._id,
      }).populate("users", "_id name photoUrl");
      res.status(200).json(fullConv);
    } catch (err) {
      next(err);
    }
  }
};

export const fetchConversations = async (req, res, next) => {
  try {
    Conversation.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "_id name photoUrl")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        res.status(200).send(results);
      });
  } catch (err) {
    next(err);
  }
};

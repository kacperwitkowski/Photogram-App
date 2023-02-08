import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import AuthRoute from "./routes/auth.js";
import PostRoute from "./routes/post.js";
import UserRoute from "./routes/user.js";
import MessageRoute from "./routes/message.js";
import ConversationRoute from "./routes/conversation.js";
import CommentRoute from "./routes/comments.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const PORT = process.env.PORT || 3001;

const app = express();

mongoose.connect(process.env.MONGODB, {}, () => {
  console.log("connected to DB");
});

app.use(express.json());

app.use("/comments", CommentRoute);
app.use("/auth", AuthRoute);
app.use("/posts", PostRoute);
app.use("/users", UserRoute);
app.use("/message", MessageRoute);
app.use("/conv", ConversationRoute);

const httpServer = createServer(app);
const io = new Server(httpServer);

//////////////////////DEPLOYMENT////////////////////

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API IS WORKING");
  });
}

/////////////////////////////////

app.use((err, _, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong";

  return res.status(status).json(message);
});

//////////////////////////////////////////////////////////////

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

//////////////////////////////////////////////////////

io.on("connection", (socket) => {
  console.log("Socket connection established");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", users);
  });

  socket.on("newMessage", (newMessage) => {
    const receiverId = newMessage.conversation.users.find(
      (usr) => usr._id !== newMessage.sender._id
    );

    const user = getUser(receiverId._id);

    if (!user) return;

    io.to(user.socketId).emit("getMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

httpServer.listen(PORT);

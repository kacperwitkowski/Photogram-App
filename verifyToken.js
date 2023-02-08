import jwt from "jsonwebtoken";
import { createError } from "./createError.js";

export const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(createError(401, "There is no user token"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err)
      return next(
        createError(
          403,
          "You have to be logged in to have access to this content"
        )
      );

    req.user = user;
    next();
  });
};

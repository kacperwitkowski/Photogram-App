import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { createError } from "../createError.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  try {
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Please provide email and password"));
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      next(createError(404, "Can't find user with that email!"));
    }

    const matchPasswords = await bcrypt.compare(password, findUser.password);

    if (!matchPasswords) {
      return next(createError(400, "Password is wrong!"));
    }

    const token = jwt.sign({ _id: findUser._id }, process.env.JWT, {
      expiresIn: "90d",
    });

    const { password: changedPassword, ...others } = findUser._doc;

    res.status(200).json({ token, others });
  } catch (err) {
    next(err);
  }
};

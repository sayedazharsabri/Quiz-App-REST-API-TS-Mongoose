// import { Request, Response, NextFunction} from 'express';
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user";
import ProjectError from "../helper/error";

import { ReturnResponse } from "../utils/interfaces";

//const registerUser:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
const registerUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    //validation
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const err = new ProjectError("Validation failed!");
      err.statusCode = 422;
      err.data = validationError.array();
      throw err;
    }
    //validation end
    const email = req.body.email;
    const name = req.body.name;
    let password = await bcrypt.hash(req.body.password, 12);

    const user = new User({ email, name, password });
    const result = await user.save();
    if (!result) {
      resp = { status: "error", message: "No result found", data: {} };
      res.send(resp);
    } else {
      resp = {
        status: "success",
        message: "Registration done!",
        data: { userId: result._id },
      };
      res.send(resp);
    }
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const err = new ProjectError("Validation failed!");
      err.statusCode = 422;
      err.data = validationError.array();
      throw err;
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user with email
    const user = await User.findOne({ email });

    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }
    //verify password using bcrypt
    const status = await bcrypt.compare(password, user.password);

    //then decide
    if (status) {
      const token = jwt.sign({ userId: user._id }, "secretmyverysecretkey", {
        expiresIn: "1h",
      });
      resp = { status: "success", message: "Logged in", data: { token } };
      res.status(200).send(resp);
    } else {
      const err = new ProjectError("Credential mismatch");
      err.statusCode = 401;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const isUserExist = async (email: String) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return true;
};

const isPasswordValid = async (password: String) => {
  let flag = 0;
  if (
    password.indexOf("!") == -1 &&
    password.indexOf("@") == -1 &&
    password.indexOf("#") == -1 &&
    password.indexOf("$") == -1 &&
    password.indexOf("*") == -1
  ) {
    return false;
  }
  for (let ind = 0; ind < password.length; ind++) {
    let ch = password.charAt(ind);
    if (ch >= "a" && ch <= "z") {
      flag = 1;
      break;
    }
    flag = 0;
  }
  if (!flag) {
    return false;
  }
  flag = 0;
  for (let ind = 0; ind < password.length; ind++) {
    let ch = password.charAt(ind);
    if (ch >= "A" && ch <= "Z") {
      flag = 1;
      break;
    }
    flag = 0;
  }
  if (!flag) {
    return false;
  }
  flag = 0;
  for (let ind = 0; ind < password.length; ind++) {
    let ch = password.charAt(ind);
    if (ch >= "0" && ch <= "9") {
      flag = 1;
      break;
    }
    flag = 0;
  }
  if (flag) {
    return true;
  }
  return false;
};

export { registerUser, loginUser, isUserExist, isPasswordValid };

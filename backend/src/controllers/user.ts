import { RequestHandler } from "express";

import ProjectError from "../helper/error";
import User from "../models/user";
import { ReturnResponse } from "../utils/interfaces";

const getUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;

  try {
    const userId = req.userId;

    if (!userId) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 401;
      throw err;
    }
    const user = await User.findById(userId, { name: 1, email: 1 });
    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    } else {
      resp = { status: "success", message: "User found", data: user };
      res.status(200).send(resp);
    }
  } catch (error: any) {
    next(error);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  const userId = req.userId;
  try {
    if (!userId) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }

    user.name = req.body.name;
    await user.save();

    resp = { status: "success", message: "User Updated", data: {} };
    res.send(resp);
  } catch (error) {
    next(error);
  }
};

// Email functionality import
import sendEmail from "../utils/email";
import jwt from "jsonwebtoken";

const deactivateUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  const userId = req.userId;
  
  try {
    if (!userId) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }


    // Email verification when User wants to deactivated account
    const secretKey = process.env.SECRET_KEY || "";
    const emailToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5m",
    });

    const message = `
    Click on the below link to deactivate your account:
    http://${process.env.BASE_URL}/user/deactivate/${emailToken}
    
    (Note: If the link is not clickable kindly copy the link and paste it in the browser.)`;
    sendEmail(user.email, "Verify Email", message);
    resp = {
      status: "success",
      message: "An Email has been sent to your account please verify!",
      data: {},
    };


    // user.isDeactivated = true;
    // await user.save();

    // resp = { status: "success", message: "User deactivated!", data: {} };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};


// for verify Email link when user want to deactivated account
// Path -> base_url/user/deactivate/:token
const deactivateUserCallback: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    // find secretKey from env file
    const secretKey = process.env.SECRET_KEY || "";
    let decodedToken;
    // find token from params
    const token = req.params.token;
    // decoded token using jwt
    decodedToken = <any>jwt.verify(token, secretKey);

    // if not decode then link expire or invalid link
    if (!decodedToken) {
      const err = new ProjectError("Invalid link!");
      err.statusCode = 401;
      throw err;
    }

    // console.log("Decode deactivate link token: ", decodedToken);
    const userId = decodedToken.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      const err = new ProjectError("User not found!");
      err.statusCode = 404;
      throw err;
    }
    user.isDeactivated = true;
    await user.save();
    resp = { status: "success", message: "Account Deactivated! Successfully", data: {} };
    res.status(200).send(resp);
  }
  catch (error) {
    next(error);
  }
}


// Check user Activate or not
const isActiveUser = async (userId: String) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new ProjectError("User not found!");
    err.statusCode = 404;
    throw err;
  }
  return !user.isDeactivated;
};

export { deactivateUser, getUser, isActiveUser, updateUser,deactivateUserCallback };

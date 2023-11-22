import { RequestHandler } from "express";
import bcrypt from "bcryptjs";

import ProjectError from "../helper/error";
import User from "../models/user";
import { ReturnResponse } from "../utils/interfaces";

import sendEmail from "../utils/email";


import OTP from "../models/otp"
import { sendDeactivateEmailOTP } from "./otp";

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


const changePassword: RequestHandler = async (req, res, next) => {
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
      const err = new ProjectError("User does not exist");
      err.statusCode = 401;
      throw err;
    }

    const currentPassword = req.body.currentPassword;
    let newPassword = await bcrypt.hash(req.body.newPassword, 12);
    const confirmPassword = req.body.confirmPassword;

    // checking if current password is same as user password
    const status = await bcrypt.compare(currentPassword, user.password);
    if (!status) {
      const err = new ProjectError(
        "Current Password is incorrect. Please try again."
      );
      err.statusCode = 401;
      throw err;
    }

    // checking if new password is same as confirm password
    const isPasswordMatching = await bcrypt.compare(
      confirmPassword,
      newPassword
    );
    if (!isPasswordMatching) {
      const err = new ProjectError(
        "New password does not match. Enter new password again "
      );
      err.statusCode = 401;
      throw err;
    }

    // checking if current password and new password are same
    const prevPasswordSame = await bcrypt.compare(currentPassword, newPassword)
    if (prevPasswordSame) {
      const err = new ProjectError(
        "Same as current password. Try another one"
      );
      err.statusCode = 401;
      throw err;
    }

    user.password = newPassword;
    await user.save();
    resp = { status: "success", message: "Password updated", data: {} };
    res.send(resp);
  } catch (error) {
    next(error);
  }
};



// Send otp for deactivate user account
const deactivateUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  // get userId from authorization token
  const userId = req.userId;
  try {
    // if userId not found then throw a not authorized error
    if (!userId) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 401;
      throw err;
    }

    // find user in User DataBase
    const user = await User.findById(userId);
    //if user does not exist then throw a Error User not exist
    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }
    
    // find OTP for same email if already present then resend otp take time
    const otpExist = await OTP.findOne({ email:user.email });

    // otp found then throw an error as resend otp after some time
    if (otpExist) {
      // find Create otp time
      const otpExistCreatedAt = new Date(otpExist.createdAt); // Assuming otpExist.createdAt is a Date object
      // find current time
      const currentTime = new Date();
      // change time into milliseconds and find difference between them
      const timeDifferenceInMilliseconds = (otpExistCreatedAt.getTime() + 120000) - currentTime.getTime();
      // convert milliseconds to minutes
      const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
      // get rest expire time
      const timeExpire = timeDifferenceInMinutes;

      const err = new ProjectError(`Resend OTP after ${timeExpire + 1} minutes`);
      err.statusCode = 401;
      throw err;
    }

    // Send a deactivate email OTP
    const sendDeactivateOTP = sendDeactivateEmailOTP(user.email);
    // if otp not send then throw an error OTP not send
    if (!sendDeactivateOTP) {
      const err = new ProjectError("Email OTP has not sent..");
      err.statusCode = 401;
      throw err;
    }
    // if OTP send sucessfully then return a response otp send
    resp = {
      status: "success",
      message: "An Email OTP has been sent to your account please verify!",
      data: {},
    };
    res.status(200).send(resp);

    } catch (error) {
    next(error);
  }
};


//Verify Deactivate Email OTP
const verifyDeactivateAccountOTP: RequestHandler = async (req, res, next) => {
  try {
    let resp: ReturnResponse;
    // take otp from body
    const otp = req.body.otp;
    // take userid from authorization token
    const userId = req.userId;
    // find user exits or not
    const user = await User.findById({ _id: userId });
    // if user does not exist then throw an error User not found
    if (!user) {
      const err = new ProjectError("User Not Fount..");
      err.statusCode = 401;
      throw err;
    }
    // Check user already deactivate or not
    if (user && user.isDeactivated) {
      const err = new ProjectError("User already Deactivaated");
      err.statusCode = 401;
      throw err;
    }

    const email = user.email;
    //find last send otp of same email
    const matchOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("Match OTP : ", matchOTP);
    // if otp not found for this email then throw an error
    if (matchOTP.length === 0) {
      // OTP not found for the email
      const err = new ProjectError("OTP has not send on this email ");
      err.statusCode = 400;
      throw err;

    }
    // Check OTP match or not, if not match then throw an error Incorrect OTP
    else if (otp != matchOTP[0].otp) {      
      // The otp is not Correct
      const err = new ProjectError("Incorrect OTP");
      err.statusCode = 400;
      throw err;
    }

    // Deactivate Account
    user.isDeactivated = true;
    // Save result into database
    const result = await user.save();
    resp = { status: "success", message: "Deactivate Account Successfull !!", data: { userId: user._id,email:email } };
    res.status(200).send(resp);

  } catch (error) {
    next(error);
  }
}



const isActiveUser = async (userId: String) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new ProjectError("User not found!");
    err.statusCode = 404;
    throw err;
  }
  return !user.isDeactivated;
};

export { deactivateUser, getUser, isActiveUser, updateUser, changePassword, verifyDeactivateAccountOTP};

// import { Request, Response, NextFunction} from 'express';
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import ProjectError from "../helper/error";
import User from "../models/user";
import sendEmail from "../utils/email";
import { ReturnResponse } from "../utils/interfaces";

import OTP from "../models/OTP"

const secretKey = process.env.SECRET_KEY || "";

//const registerUser:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
const registerUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const email = req.body.email;
    const name = req.body.name;
    let password = await bcrypt.hash(req.body.password, 12);

    const otp = req.body.otp;
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("Response OTP : ", response);
    if (response.length === 0) {
      // OTP not found for the email

      resp = {
        status: "error",
        message: "The otp is not valid because not found in OTP DB",
        data: {  },
      };
      res.status(400).send(resp);

    }
    else if (otp != response[0].otp) {
      // The otp is not valid
      resp = {
        status: "error",
        message: "Incorrect OTP",
        data: {  },
      };
      res.status(400).send(resp);
    }

    const user = new User({ email, name, password });
    const result = await user.save();
    if (!result) {
      resp = { status: "error", message: "No result found", data: {} };
      res.status(404).send(resp);
    } else {
      resp = {
        status: "success",
        message: "Registration done!",
        data: { userId: result._id },
      };
      res.status(201).send(resp);
    }
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const email = req.body.email;
    const password = req.body.password;

    //find user with email
    const user = await User.findOne({ email });

    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }

    //verify if user is deactivated ot not

    if (user.isDeactivated) {
      const err = new ProjectError("Account is deactivated!");
      err.statusCode = 401;
      throw err;
    }
    //verify password using bcrypt
    const status = await bcrypt.compare(password, user.password);

    //then decide
    if (status) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
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

//re-activate user
const activateUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const email = req.body.email;

    //find user with email
    const user = await User.findOne({ email });

    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }

    //verify if user is deactivated or not
    if (!user.isDeactivated) {
      const err = new ProjectError("User is already activated!");
      err.statusCode = 422;
      throw err;
    }

    const emailToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5m",
    });

    const message = `
    Click on the below link to activate your account:
    http://${process.env.BASE_URL}/auth/activate/${emailToken}
    
    (Note: If the link is not clickable kindly copy the link and paste it in the browser.)`;
    sendEmail(user.email, "Verify Email", message);
    resp = {
      status: "success",
      message: "An Email has been sent to your account please verify!",
      data: {},
    };

    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const activateUserCallback: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    //verify token sent
    const secretKey = process.env.SECRET_KEY || "";
    let decodedToken;
    const token = req.params.token;
    decodedToken = <any>jwt.verify(token, secretKey);

    if (!decodedToken) {
      const err = new ProjectError("Invalid link!");
      err.statusCode = 401;
      throw err;
    }

    const userId = decodedToken.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      const err = new ProjectError("User not found!");
      err.statusCode = 404;
      throw err;
    }

    user.isDeactivated = false;
    await user.save();

    resp = { status: "success", message: "Account activated!", data: {} };
    res.status(200).send(resp);
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


import otpGenerator from "otp-generator";
// import OTP from "../models/OTP"
// OTP send function
const sendOTP: RequestHandler = async (req, res, next) => { 

  let resp: ReturnResponse;

  try {

    const { email } = req.body;

    // check if user already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of sign up

    // if user found then return a error response
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      const err = new ProjectError("user already Registered..");
      err.statusCode = 401;
      throw err;
    }

    // generate otp 
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    })

    const result = await OTP.findOne({ otp: otp });
    console.log("Result is generate OTP function");
    console.log("OTP: ", otp);
    console.log("Result : ", result);
    // when result find then change the otp always unique otp store in database
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      })      
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    console.log("Otp Body : ", otpBody);


    resp = { status: "success", message: "OTP send successfully", data: {otp} };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }

  

}


export {
  activateUser,
  activateUserCallback,
  isPasswordValid,
  isUserExist,
  loginUser,
  registerUser,
  sendOTP
};

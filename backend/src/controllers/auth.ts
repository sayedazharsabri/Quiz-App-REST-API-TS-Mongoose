import nodemailer from 'nodemailer';
// import { Request, Response, NextFunction} from 'express';
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import ProjectError from "../helper/error";
import User from "../models/user";
import sendEmail from "../utils/email";
import { ReturnResponse } from "../utils/interfaces";
import Mailgen from 'mailgen';
import { startExam } from './exam';

const secretKey = process.env.SECRET_KEY || "";

//const registerUser:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
const registerUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const email = req.body.email;
    const name = req.body.name;
    let password = await bcrypt.hash(req.body.password, 12);

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
    if (user?.accountblocked) { //if account is blocked due to multiple attempts it is checking the remaining time left to unblock the account
      const time = 86400 - (new Date().getTime() - user?.FreezeTime.getTime()) / 1000;
      const hoursLeft = Math.floor(time / (60 * 60));
      const minutesLeft = Math.floor((time / 60) - (hoursLeft * 60));
      if (hoursLeft <= 0 && minutesLeft <= 0) { //This function is used if the limit of time is over it will unblock the account
        user && (user.RemainingTry = 3);
        user && (user.accountblocked = false)
        user && (user.temperoryKey = '')
        await user?.save();
      }
      else {  //This function is used if the limit of time is not over it will throw an error and show the remaining time left to unblock the account
        const err = new ProjectError(`Your account have been blocked due to multiple attempts! try back after ${hoursLeft} hours and ${minutesLeft} minutes`);
        err.statusCode = 401;
        throw err;
      }
    }
    if (status && !user?.accountblocked) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1h",
      });

      user && (user.RemainingTry = 3);
      user && (user.temperoryKey = '');
      user && (user.accountblocked = false);
      user && (user.istempkeyused = false);

      await user?.save();
      resp = { status: "success", message: "Logged in", data: { token } };
      res.status(200).send(resp);
    } else {  //This function is used if the password is wrong it will decrease the remaining try by 1 and if the remaining try is 0 it will throw an error for the maximum invalid attempts
      const updated = await User.findOneAndUpdate({ email: user.email }, { $inc: { RemainingTry: -1 } }, { new: true })
      if (updated && updated?.RemainingTry < 1) {
        if (updated?.temperoryKey.length && !updated?.accountblocked) {
          user?.istempkeyused && (updated.accountblocked = true);
          user?.istempkeyused && (updated.temperoryKey = '');
          updated && (updated.FreezeTime = new Date());
          await updated?.save();

          //This function is used if the account is blocked user will recieve an email with a temperory key to activate the account if it is used and still invalid tries take place it will blocks the account for 24 hours otherwise it will tell the user to check your registered email address

          const err = new ProjectError(`${user?.istempkeyused ? "Your account have been blocked due to multiple attempts for 24 hours" : "Your Account has been deactivated check your registered email for further instructions!"}`);
          err.statusCode = 401;
          throw err;
        }

        //The following formula is used to generate an 8 digit temperory key and generate the email to the user and calculate the freezee time and temperory key
        const temperoryKey = Math.random().toString(36).substring(2, 10);
        generateEmail(updated?.name || '', temperoryKey, updated?.email || '');
        updated && (updated.FreezeTime = new Date());
        updated && (updated.temperoryKey = temperoryKey);
        await updated?.save();
        const err = new ProjectError(`Your Account has been deactivated check your registered email for further instructions`);
        err.statusCode = 401;
        throw err;
      }
      //If the password is wrong it will throw an error with the remaining try
      const err = new ProjectError(`Credential mismatch Try Left ${updated && (updated?.RemainingTry)}`);
      err.statusCode = 401;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// The activateAccount function is used to activate the account of the user by using the temperory key sent to the user's email address
const activateAccount: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new ProjectError("No user exist");
      err.statusCode = 401;
      throw err;
    }
    if (req.body.key == user?.temperoryKey) {
      user && (user.RemainingTry = 1);
      user && (user.istempkeyused = true)
      await user?.save();
      const resp = { status: "success", message: "Key Validated you have only attempt for login" };
      res.status(302).send(resp);
    }
    else if (!user?.temperoryKey.length) {
      const err = new ProjectError("User is already Activated");
      err.statusCode = 403;
      throw err;
    }
    else {
      const err = new ProjectError("Invalid Key");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

//The following function is used to generate the email to the user
const generateEmail = (name: string, temperoryKey: string, emailaddress: string) => {
  const userEmail = process.env.USER || "";
  const userPassword = process.env.PASS || "";

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userEmail,
      pass: userPassword
    }
  });

  //Using MaylGenerator Library to generate the email
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Quiz Application",
      link: '/'
    }
  })
  let response = {
    body: {
      name: name,
      intro: "Your Account has been freezed due to some unusual activity on your account",
      table: {
        data: [
          {
            "Temporary Key": temperoryKey
          }
        ]
      },
      action: {
        instructions: 'If you believe that is by mistake here is your one time temporary key to activate your account after activating your account you can login once after this your account will be deactived for 24 hrs',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
        }
      },
      outro: "Discover your inner genius - Take the quiz now!"
    }
  }
  let mail = MailGenerator.generate(response)
  let message = {
    from: userEmail,
    to: emailaddress,
    subject: "Quiz Account Freezed",
    html: mail
  }

  transporter.sendMail(message).then(() => {
    console.log("Email Sent ");
  }).catch(error => {
    console.log("Unable to Send the Email");
  })
}
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

    const userEmail = process.env.USER || "";
    const userPassword = process.env.PASS || "";

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: userPassword
      }
    });

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Quiz Application",
        link: '/'
      }
    })

    let response = {
      body: {
        name: user.name,
        intro: "Your Account Activation request is Approved Successfully",
        action: {
          instructions: 'Click the button below to activate your user account.',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Activate Account',
            link: message
          }
        },
        outro: "Discover your inner genius - Take the quiz now!"
      }
    }
    let mail = MailGenerator.generate(response)
    let messages = {
      from: userEmail,
      to: user.email,
      subject: "Quiz Account Activated",
      html: mail
    }

    transporter.sendMail(messages).then(() => {
      console.log("Email Sent ");
    }).catch(error => {
      console.log("Unable to Send the Email");
    })

    resp = {
      status: "success",
      message: "An Email has been sent to your account please verify!",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
}

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


export {
  activateUser,
  activateUserCallback,
  isPasswordValid,
  isUserExist,
  loginUser,
  registerUser,
  activateAccount
};

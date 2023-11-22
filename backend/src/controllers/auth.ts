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


import OTP from "../models/otp"
import sendEmailOTPRegister from "./otp"



const secretKey = process.env.SECRET_KEY || "";
const SERVER_BASE_URL = process.env.BASE_URL;

//const registerUser:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
const registerUser: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
  try {
    // take email , name , password from body
    const email = req.body.email;
    const name = req.body.name;
    // using bcrypt hash the password
    let password = await bcrypt.hash(req.body.password, 12);

    //create a token using email
    const token = jwt.sign({ email: email }, secretKey);
    // send email otp for registration
    const sendOtp = await sendEmailOTPRegister(email);
    // if email send successfull
    if (sendOtp) {
      // check user already present in User DataBase or not
      const checkUserExits = await User.findOne({ email });
      // if User present in databse then only update the data 
      if (checkUserExits) {
           // update data
           checkUserExits.name = name;
           checkUserExits.password = password;
           await checkUserExits.save()
           resp = {
              status: "success",
              message: "OTP has sent on your email. Please Verify..",
              // data: { userId: checkUserExits._id, token:token },
             data: { email, token: token },
          };
          res.status(201).send(resp);
      }
      else {
        // if user does not present in Databse then create a new entry 
            const user = new User({ email, name, password });
            const result = await user.save();
             if (!result) {
                resp = { status: "error", message: "No result found", data: {} };
                res.status(404).send(resp);
             }
             else {
                 resp = {
                 status: "success",
                   message: "OTP has sent on your email. Please Verify",
                  data: { email,token:token },
              };
              res.status(201).send(resp);
         }
      }
    }
    else {
      const err = new ProjectError("OTP not send..");
      err.statusCode = 401;
      throw err;
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
    // if user has not verified email otp.
    if (!user.isVerified) {
      const err = new ProjectError("Account is not Verified. Please verify your account");
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
    if (user?.accountBlocked) { //if account is blocked due to multiple attempts it is checking the remaining time left to unblock the account
      const time = 86400 - (new Date().getTime() - user?.freezeTime.getTime()) / 1000;
      const hoursLeft = Math.floor(time / (60 * 60));
      const minutesLeft = Math.floor((time / 60) - (hoursLeft * 60));
      if (hoursLeft <= 0 && minutesLeft <= 0) { //This function is used if the limit of time is over it will unblock the account
        user && (user.remainingTry = 3);
        user && (user.accountBlocked = false)
        user && (user.temperoryKey = '')
        await user?.save();
      }
      else {  //This function is used if the limit of time is not over it will throw an error and show the remaining time left to unblock the account
        const err = new ProjectError(`Your account have been blocked due to multiple attempts! try back after ${hoursLeft} hours and ${minutesLeft} minutes`);
        err.statusCode = 401;
        throw err;
      }
    }
    
    if(status && !user?.accountBlocked && user?.remainingTry < 1 ){
      const err = new ProjectError('Your account is deactivated');
        err.statusCode = 401;
        throw err;
    }

    if (status && !user?.accountBlocked) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "10h",
      });

      user && (user.remainingTry = 3);
      user && (user.temperoryKey = '');
      user && (user.accountBlocked = false);
      user && (user.isTempKeyUsed = false);

      await user?.save();
      resp = { status: "success", message: "Logged in", data: { token } };
      res.status(200).send(resp);
    } else {  //This function is used if the password is wrong it will decrease the remaining try by 1 and if the remaining try is 0 it will throw an error for the maximum invalid attempts
      const updated = await User.findOneAndUpdate({ email: user.email }, { $inc: { remainingTry: -1 } }, { new: true })
      if (updated && updated?.remainingTry < 1) {
        if (updated?.temperoryKey.length && !updated?.accountBlocked) {
          user?.isTempKeyUsed && (updated.accountBlocked = true);
          user?.isTempKeyUsed && (updated.temperoryKey = '');
          updated && (updated.freezeTime = new Date());
          await updated?.save();

          //This function is used if the account is blocked user will recieve an email with a temperory key to activate the account if it is used and still invalid tries take place it will blocks the account for 24 hours otherwise it will tell the user to check your registered email address

          const err = new ProjectError(`${user?.isTempKeyUsed ? "Your account have been blocked due to multiple attempts for 24 hours" : "Your Account has been deactivated check your registered email for further instructions!"}`);
          err.statusCode = 401;
          throw err;
        }

        //The following formula is used to generate an 8 digit temperory key and generate the email to the user and calculate the freezee time and temperory key
        const temperoryKey = Math.random().toString(36).substring(2, 10);
        generateEmail(updated?.name || '', temperoryKey, updated?.email || '');
        updated && (updated.freezeTime = new Date());
        updated && (updated.temperoryKey = temperoryKey);
        await updated?.save();
        const err = new ProjectError(`Your Account has been deactivated check your registered email for further instructions`);
        err.statusCode = 401;
        throw err;
      }
      //If the password is wrong it will throw an error with the remaining try
      const err = new ProjectError(`Credential mismatch Try Left ${updated && (updated?.remainingTry)}`);
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
      user && (user.remainingTry = 1);
      user && (user.isTempKeyUsed = true)
      await user?.save();
      const resp = { status: "success", message: "Key Validated you have only attempt for login" };
      res.status(200).send(resp);
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
const generateEmail = async (name: string, temperoryKey: string, emailaddress: string) => {
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
        instructions: `This is your one time temporary key to activate your account. After activating your account you will get one more chance to login. If you failed to login this time your account will be blocked for 24 hours.
        `,
        button: {
          text: 'Thank You',
          link: `http://${SERVER_BASE_URL}/auth/activateaccount/${temperoryKey}`
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

  }).catch(error => async () =>{
    let user = await User.findOne({ email: emailaddress }); //If there is some issue in generating email set the temperory key string in collection to empty
    user && (user.temperoryKey = '');
    await user?.save();
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
          instructions: `Click the button below to activate your user account.  <br><br>
          Note: If the button or link is not clickable kindly copy the link and paste it in the browser<br><br>
          http://${SERVER_BASE_URL}/auth/activate/${emailToken}<br><br>
          `,
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Activate Account',
            link: `http://${SERVER_BASE_URL}/auth/activate/${emailToken}/`
          },
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

//forgot password
const forgotPassword: RequestHandler = async (req, res, next) => {
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

    const emailToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "5m",
    });

    const message = `
    Click on the below link to reset the password of your account:
    http://${process.env.BASE_URL}/auth/forgotpassword/${emailToken}
    
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

const forgotPasswordCallback: RequestHandler = async (req, res, next) => {
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

    // const redirectLink = `http://${process.env.BASE_URL}/auth/forgotpassword/${userId}`;
    // res.redirect(redirectLink);
    console.log(`http://${process.env.BASE_URL}/auth/forgotpassword/${userId}`);

  } catch (error) {
    next(error);
  }
};

const resetPassword: RequestHandler = async(req, res, next) => {
  let resp: ReturnResponse;
  try {

    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      const err = new ProjectError("User not found!");
      err.statusCode = 404;
      throw err;
    }

    let password = await bcrypt.hash(req.body.password, 12);
    const confirmPassword = req.body.confirmPassword;

    // checking if password and confirmpassword are the same
    const isPasswordMatching = await bcrypt.compare(confirmPassword,password);
    if (!isPasswordMatching) {
      const err = new ProjectError(
        "New password does not match. Enter new password again "
      );
      err.statusCode = 401;
      throw err;
    }

    user.password = password;
    await user.save();
    resp = { status: "success", message: "Password updated", data: {} };
    res.send(resp);
  } catch (error) {
    next(error);
  }
}

const isUserExist = async (email: String) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  else if (user && !user.isVerified) {
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



// Verify Registration Email OTP

const verifyRegistrationOTP: RequestHandler = async (req, res, next) => {
  try {
    let resp: ReturnResponse;
    // const email = req.params.email;
    const secretKey = process.env.SECRET_KEY || "";
    // decode the params token
    let decodedToken: { email: String }
    decodedToken = <any>jwt.verify(req.params.token, secretKey);
    // convert Object String to string
    const email = decodedToken.email.toString();

    // take otp from body
    const otp = req.body.otp;
    // console.log("Email from params : ", email);
    // console.log("Email from BODY OTP : ", otp);

    // Check User present or not
    const user = await User.findOne({ email });
    if (!user) {
      const err = new ProjectError("No user exist..");
      err.statusCode = 401;
      throw err;
    }
    // Check User already verified or not
    if (user && user.isVerified) {
      const err = new ProjectError("User already exist");
      err.statusCode = 401;
      throw err;
    }

    // find last send otp for this email 
    const matchOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    // if otp not present for this email
    if (matchOTP.length === 0) {
      // OTP not found for the email
      const err = new ProjectError("OTP has not send on this email or Invalid OTP");
      err.statusCode = 400;
      throw err;

    }
    // if otp not present
    else if (otp != matchOTP[0].otp) {
      // The otp is not valid
      const err = new ProjectError("Incorrect OTP");
      err.statusCode = 400;
      throw err;
    }

    // update data verified true 
    user.isVerified = true;
    const result = await user.save();
    resp = { status: "success", message: "Registration Done !!", data: { userId : user._id,email } };
    res.status(200).send(resp);
  } catch (error) {
    console.log("Error in verify Registration OTP : ", error);
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
  activateAccount,
  forgotPassword,
  forgotPasswordCallback,
  resetPassword,
  verifyRegistrationOTP
};

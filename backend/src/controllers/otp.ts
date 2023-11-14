import sendEmail from "../utils/email";
import OTP from "../models/otp"
import User from "../models/user"
import otpGenerator from "otp-generator"
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";
import { RequestHandler } from "express";



// Define a function to send emails

async function sendEmailOTPRegister(email: string) {
    
    try {
        let resp: ReturnResponse;
        // check if user already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ email });
        // to be used in case of sign up

        // if user found then return a error response
        if (checkUserPresent && checkUserPresent.isVerified) {
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
        // when result find then change the otp always unique otp store in database
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }        
        const mailResponse = await sendEmail(
            email,
            "Verification Registration Email OTP ",
            `Registration OTP is ${otp}`
        );

        const saveOTP = new OTP({ email, otp });
        const saveResult = await saveOTP.save();
        
        if (!saveResult) {
            const err = new ProjectError("OTP has not save in DataBase");
            err.statusCode = 401;
            throw err;
        } else {
            return true;
           
        }
    }
    catch (error) {
        throw error;
    }
}

export default sendEmailOTPRegister;

import jwt from "jsonwebtoken";
const resendRegistrationOTP: RequestHandler = async (req, res, next) => {
    try {
        let resp: ReturnResponse;
        // const email = req.params.email;
        const secretKey = process.env.SECRET_KEY || "";
        let decodedToken : {email : String}
         decodedToken = <any>jwt.verify(req.params.token, secretKey);
        const email = decodedToken.email.toString();
        
        const checkUserExits = await User.findOne({ email });
        if (!checkUserExits) {
            const err = new ProjectError("User not exist..");
            err.statusCode = 401;
            throw err;
        }
        if (checkUserExits && checkUserExits.isVerified) {
            const err = new ProjectError("Already Verified your Account");
            err.statusCode = 401;
            throw err;
        }
        const otpExist = await OTP.findOne({ email });
        
        if (otpExist) {
            const otpExistCreatedAt = new Date(otpExist.createdAt); // Assuming otpExist.createdAt is a Date object

            const currentTime = new Date();
            const timeDifferenceInMilliseconds = (otpExistCreatedAt.getTime() + 120000) - currentTime.getTime();
            const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

            const timeExpire = timeDifferenceInMinutes;

            const err = new ProjectError(`Resend OTP after ${timeExpire+1} minutes`);
            err.statusCode = 401;
            throw err;
        }
        const sendOTP = await sendEmailOTPRegister(email);
        if (!sendOTP) {
            const err = new ProjectError("Resend otp Error");
            err.statusCode = 401;
            throw err;
        }
        resp = { status: "success", message: "OTP send successfully. Please Verify Account", data: {  } };
        res.status(200).send(resp);
        
    } catch (error) {
        next(error);
    }
}

export { resendRegistrationOTP };
    
    
async function sendDeactivateEmailOTP(email: string) {

    try {
        let resp: ReturnResponse;
        // check if user already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ email });
        // to be used in case of sign up

        // if user found then return a error response
        if (checkUserPresent && checkUserPresent.isDeactivated) {
            // Return 401 Unauthorized status code with error message
            const err = new ProjectError("user already Deactivate..");
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

        // when result find then change the otp always unique otp store in database
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }
        const mailResponse = await sendEmail(
            email,
            "Verification Deactivate Account Email OTP",
            `Deactivate Account OTP is ${otp}`
        );
        console.log("Email send successfully: ", mailResponse);
        const saveOTP = new OTP({ email, otp });
        const saveResult = await saveOTP.save();

        if (!saveResult) {
            const err = new ProjectError("OTP has not save in DataBase");
            err.statusCode = 401;
            throw err;
        } else {
            console.log("Successfully Save otp please verify..")
            return true;

        }
    }
    catch (error) {
        console.log("Error occured while sending email: ", error);
        throw error;
    }
}

export { sendDeactivateEmailOTP }; 




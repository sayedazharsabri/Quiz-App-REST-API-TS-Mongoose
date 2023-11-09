import sendEmail from "../utils/email";
import OTP from "../models/otp"
import User from "../models/user"
import otpGenerator from "otp-generator"
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";
import { RequestHandler } from "express";



// Define a function to send emails

async function sendEmailOTPRegister(email: string) {
    // create a transporter to send emails

    // Define the email options

    // Send the email

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
        const mailResponse = await sendEmail(
            email,
            "Verification Registration Email OTP ",
            `Registration OTP is ${otp}`
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

export default sendEmailOTPRegister;


const resendRegistrationOTP: RequestHandler = async (req, res, next) => {
    try {
        let resp: ReturnResponse;
        const email = req.params.email;
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
    // create a transporter to send emails

    // Define the email options

    // Send the email

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

// // Define a post-save hook to send email after the document has been saved

// OTP.pre("save", async function (next:any) {
//     console.log("New document saved to database");

//     // only send an email when a new document is created
//     if (this.isNew) {
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// });
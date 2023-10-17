import mongoose from "mongoose";

import  sendEmail  from "../utils/email"

const schema = mongoose.Schema;

const OTPSchema = new schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,  // This document will be automatically deleted after 5 minutes of its creation time

    }
});

// Define a function to send emails

async function sendVerificationEmail(email:any, otp:any) {
    // create a transporter to send emails

    // Define the email options

    // Send the email

    try {
        const mailResponse = await sendEmail(
            email,
            "Verification OTP Email",
            otp
        );
        console.log("Email send successfully: ", mailResponse.response);
    }
    catch (error) {
        console.log("Error occured while sending email: ", error);
        throw error;
    }
}


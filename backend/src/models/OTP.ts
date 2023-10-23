import mongoose from "mongoose";

import sendEmail from "../utils/email"


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
        expires: 60 * 2,  // This document will be automatically deleted after 5 minutes of its creation time

    }
});

// Define a function to send emails

async function sendVerificationEmail(email:string, otp:string) {
    // create a transporter to send emails

    // Define the email options

    // Send the email

    try {
        
        const mailResponse = await sendEmail(
            email,
            "Verification OTP Email",
            otp
        );
        console.log("Email send successfully: ", mailResponse);
    }
    catch (error) {
        console.log("Error occured while sending email: ", error);
        throw error;
    }
}

// Define a post-save hook to send email after the document has been saved

OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");

    // only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;


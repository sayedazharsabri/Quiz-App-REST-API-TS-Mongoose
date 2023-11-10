import mongoose from "mongoose";




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
        expires: 60 * 2,  // This document will be automatically deleted after 2 minutes of its creation time

    }
});


const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;


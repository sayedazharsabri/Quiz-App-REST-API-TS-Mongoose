import sendEmail from "../utils/email";
// import OTP from "../models/otp"



// Define a function to send emails

async function sendEmailOTPRegister(email: string, otp: string) {
    // create a transporter to send emails

    // Define the email options

    // Send the email

    try {

        const mailResponse = await sendEmail(
            email,
            "Verification OTP Email",
            otp
        );
        console.log("Email send successfully: ",mailResponse);
    }
    catch (error) {
        console.log("Error occured while sending email: ", error);
        throw error;
    }
}

export default sendEmailOTPRegister;

// // Define a post-save hook to send email after the document has been saved

// OTP.pre("save", async function (next:any) {
//     console.log("New document saved to database");

//     // only send an email when a new document is created
//     if (this.isNew) {
//         await sendVerificationEmail(this.email, this.otp);
//     }
//     next();
// });
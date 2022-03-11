import nodemailer from "nodemailer";
import ProjectError from "../helper/error";

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const emailSent = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log(emailSent);
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    const err = new ProjectError("email not sent");
    err.statusCode = 401;
    throw err;
  }
};

export default sendEmail;

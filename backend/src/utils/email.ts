import nodemailer from "nodemailer";

import ProjectError from "../helper/error";

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
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
    console.log("message sent: %s", emailSent.messageId);
  } catch (error) {
    const err = new ProjectError("email not sent");
    err.statusCode = 401;
    throw err;
  }
};

export default sendEmail;

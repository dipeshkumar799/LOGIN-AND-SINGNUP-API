import nodemailer from "nodemailer";
// create reusable transporter object using the default SMTP transport
import { config } from "dotenv"; // Load environment variables from .env file
config();

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USER, // generated ethereal user
      pass: process.env.MAILTRAP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAILTRAP_EMAIL, // sender address
    to,
    subject,
    text,
  });

  return info.messageId;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

export default sendEmail;

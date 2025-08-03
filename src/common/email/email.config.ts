import nodemailer from "nodemailer";
import config from "config";

const emailService = config.get<string>("email.service");
const emailUser = config.get<string>("email.user");
const emailPass = config.get<string>("email.pass");

export const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

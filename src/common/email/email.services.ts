import { transporter } from "./email.config";
import config from "config";

const emailUser = config.get<string>("email.user");

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Booking App" <${emailUser}>`,
    to,
    subject,
    html,
  });
};

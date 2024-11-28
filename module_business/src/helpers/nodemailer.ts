import { createTransport } from "nodemailer";

export const nodemailer = createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT!,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

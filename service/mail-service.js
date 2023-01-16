"use strict";

import nodemailer from "nodemailer";

import { config } from "../config.js";

export const sendActivationMail = async (to, link) => {
    const transport = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: false,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASSWORD,
        },
    });

    await transport.sendMail({
        from: config.SMTP_USER,
        to,
        subject: `Account activation ${config.API_URL}`,
        text: "",
        html: `
            <div>
            <h3>This message includes a validation link which you need to click on to activate your account.</h3>
            <a href="${link}">Activate your account.</a>
            
            </div>
            `,
    });
};
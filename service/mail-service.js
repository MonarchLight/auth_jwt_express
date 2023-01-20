"use strict";

import nodemailer from "nodemailer";
import { google } from "googleapis";
import { logger } from "../logger/logger.js";

import { config } from "../config.js";

const OAuth_client = new google.auth.GoogleAuth(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);

OAuth_client.setGapicJWTValues({ refresh_token: config.JWT_REFRESH_KEY });

const send_mail = (to, link) => {
    const accessToken = OAuth_client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config.SMTP_USER,
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            refreshToken: config.JWT_REFRESH_KEY,
            accessToken: accessToken,
        }
    });

    const mail_options = {
        from: config.SMTP_USER,
        to: to,
        subject: `A Message from ${config.SMTP_USER}`,
        html: get_html_message(to),

    };

    transporter.sendMail(mail_options, (err, result) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info(result);
        }
        transporter.close();
    });
};

const get_html_message = (to) => {
    return `<h3> ${to}! Best of the best.</h3>`
};

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
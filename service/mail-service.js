"use strict";

import nodemailer from 'nodemailer';

import { config } from '../config.js';

export class MailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        await this.transport.sendMail({
            from: config.SMTP_USER,
            to,
            subject: `Account activation ${process.env.API_URL}`,
            text: '',
            html: `
            <div>
            <h3>This message includes a validation link which you need to click on to activate your account.</h3>
            <a href="${link}">Activate your account.</a>
            
            </div>
            `,
        });
    }
}

// Activation Complete!
//Your Account has been successfully activated. You can now log in using the username and password you chose during the registration.
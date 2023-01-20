"use strict";

import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    "PORT": process.env.PORT,
    "MONGODB": process.env.MONGODB,
    "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY,
    "JWT_REFRESH_KEY": process.env.REFRESH_TOKEN,

    "SMTP_HOST": process.env.SMTP_HOST,
    "SMTP_PORT": process.env.SMTP_PORT,
    "SMTP_USER": process.env.SMTP_USER,
    "SMTP_PASSWORD": process.env.SMTP_PASSWORD,
    "API_URL": process.env.API_URL,
    "CLIENT_URL": process.env.CLIENT_URL,

    "GOOGLE_CLIENT_ID": process.env.GOOGLE_CLIENT_ID,
    "GOOGLE_CLIENT_SECRET": process.env.GOOGLE_CLIENT_SECRET,
    "GOOGLE_OAUTH_REDIRECT_URL": process.env.GOOGLE_OAUTH_REDIRECT_URL,
}
"use strict";

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { router } from './routes/index-router.js';
import { config } from './config.js';
import { errorMiddlewares } from './middlewares/error-middleware.js';
import { logger } from './logger/logger.js';

mongoose.set('strictQuery', false);

const PORT = config.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: config.API_URL + config.PORT,
}));
app.use('/api', router);
app.use(errorMiddlewares);

const start = async () => {
    try {
        await mongoose.connect(config.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => logger.info(`Server started on port ${PORT}`))
    } catch (error) {
        logger.error(error);
    }
};

start();
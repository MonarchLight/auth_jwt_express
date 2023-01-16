"use strict";

import jwt from 'jsonwebtoken';

import { tokenModel } from '../models/token-model.js';
import { config } from '../config.js';

export class TokenService {
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_SECRET_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_REFRESH_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }

    generateToken(payload) {
        const accessToken = jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_KEY, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }
}
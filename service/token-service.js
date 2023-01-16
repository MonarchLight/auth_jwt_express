"use strict";

import jwt from 'jsonwebtoken';

import { tokenModel } from '../models/token-model.js';
import { config } from '../config.js';


export const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, config.JWT_SECRET_KEY);
        return userData;
    } catch (error) {
        return null;
    }
}

// validateRefreshToken(token) {
//     try {
//         const userData = jwt.verify(token, config.JWT_REFRESH_KEY);
//         return userData;
//     } catch (error) {
//         return null;
//     }
// }

export const generateToken = (payload) => {
    const accessToken = jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: '30m' });
    // const refreshToken = jwt.sign(payload, config.JWT_REFRESH_KEY, { expiresIn: '30d' });
    return { accessToken }; //refreshToken
}

export const saveToken = async (userId, refreshToken) => {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
}

export const removeToken = async (refreshToken) => {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
}

// export const findToken = async (refreshToken) => {
//     const tokenData = await tokenModel.findOne({ refreshToken });
//     return tokenData;
// }
"use strict";

import { validationResult } from 'express-validator';

import * as userService from "../service/user-service.js";
import { config } from '../config.js';
import { ApiError } from "../exceptions/api-error.js";

export const singUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error.', errors.array()));
        }
        const { email, password } = req.body;
        const userData = await userService.singUp(email, password);

        //res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.login(email, password);


        //res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

export const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.status(304).redirect(config.CLIENT_URL);
    } catch (error) {
        next(error);
    }
};

// export const refresh = async (req, res, next) => {
//     try {
//         const { refreshToken } = req.cookies;
//         const userData = await userService.refresh(refreshToken);

//         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
//         return res.json(userData);
//     } catch (error) {
//         next(error);
//     }
// };

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const removeUser = async (req, res, next) => {

    try {
        const users = await userService.removeUser();
        res.status(200).json()
    } catch (error) {
        next(error);
    }
};

export const editUser = async (req, res, next) => {

    try {
        const users = await userService.editUser();
        res.status(200).json()
    } catch (error) {
        next(error);
    }
};
"use strict";

import jwt from "jsonwebtoken";

import { config } from '../config.js';

export const roleMiddle = (roles) => {
    return function (req, res, next) {
        if (req.method == 'OPTIONS') {
            next();
        }
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.UnautharizedError());
            }

            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError.UnautharizedError());
            }

            const { roles: userRoles } = jwt.verify(accessToken, config.JWT_SECRET_KEY);

            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                return res.status(403).json({ message: 'You don`t have permission to access.' });
            }
            next();
        } catch (error) {
            console.log(error);
            return next(ApiError.UnautharizedError());
        }
    }
};
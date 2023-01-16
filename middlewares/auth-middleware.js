"use strict";

import * as tokenService from "../service/token-service.js";
import { ApiError } from "../exceptions/api-error.js";

export const authMiddleware = (req, res, next) => {
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

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnautharizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnautharizedError());
    }
};
"use strict";

import { ApiError } from "../exceptions/api-error.js";
import { TokenService } from "../service/token-service.js";

const tokenService = new TokenService();

export const authMiddleware = (req, res, next) => {
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
}
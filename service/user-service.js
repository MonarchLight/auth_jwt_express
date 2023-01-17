"use strict";

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { userModel } from "../models/user-model.js";
import { roleModel } from '../models/role-model.js';
import { sendActivationMail } from "./mail-service.js";
import { UserDto } from '../dtos/user-dto.js';
import { config } from '../config.js';
import * as tokenService from "./token-service.js";
import { ApiError } from "../exceptions/api-error.js";

function errors(arg, message) {
    if (!arg) {
        throw ApiError.BadRequest(message);
    }
}

export const singUp = async (email, password) => {
    const candidate = await userModel.findOne({ email });
    errors(!candidate, 'That email is taken. Try another.')

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const activationLink = uuidv4();

    const userRole = await roleModel.findOne({ value: 'User' });
    const user = await userModel.create({ email, password: hashPassword, activationLink, roles: [userRole.value] });

    await sendActivationMail(email, `${config.API_URL + config.PORT}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
};

export const activate = async (activationLink) => {
    const user = await userModel.findOne({ activationLink });
    errors(user, 'Incorrect validation link.');

    user.activationLink = null;
    user.isActivated = true;
    await user.save();
};

export const login = async (email, password) => {
    const user = await userModel.findOne({ email });
    errors(user, `Couldn't find your account.`);

    const isPassEquals = await bcrypt.compare(password, user.password);
    errors(isPassEquals, 'Password is not correct.');

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto, };
};

export const logout = async (refreshToken) => {
    const token = await tokenService.removeToken(refreshToken);
    return token;
};

// async refresh(refreshToken) {
//     if (!refreshToken) {
//         throw ApiError.UnautharizedError();
//     }

//     const userData = tokenService.validateRefreshToken(refreshToken);

//     const tokenFromDb = await tokenService.findToken(refreshToken);
//     if (!userData || !tokenFromDb) {
//         throw ApiError.UnautharizedError();
//     }

//      if users rename email address
//     const user = await userModel.findById(userData.id);

//     const userDto = new UserDto(user);
//     const tokens = tokenService.generateToken({ ...userDto });

//     await tokenService.saveToken(userDto.id, tokens.refreshToken);
//     return { ...tokens, user: userDto, };
// }

export const getAllUsers = async () => {
    const users = await userModel.find({ _id });
    return users;
};

export const removeUser = async (id) => {
    const user = await userModel.findByIdAndRemove(id);
    errors(user, `Couldn't find your account.`);

    await tokenService.removeToken(refreshToken);
};

export const editUser = async (id, email, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userModel.findByIdAndUpdate(id, { email, password: hashPassword });
    errors(user, `Couldn't find your account.`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
};

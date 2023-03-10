"use strict";

import { Schema, model } from 'mongoose';

const user = new Schema({
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
});

export const userModel = model('user', user);
"use strict";

import { Schema, model } from 'mongoose';

const token = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    refreshToken: { type: String, require: true },
});

export const tokenModel = model('token', token);
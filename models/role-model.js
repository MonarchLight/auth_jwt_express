"use strict";

import { Schema, model } from "mongoose";

const role = new Schema({
    value: { type: String, unique: true, default: 'User' },
});

export const roleModel = model('role', role);
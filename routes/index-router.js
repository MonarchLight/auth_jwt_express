'use strict';

import { Router } from "express";
import { body } from 'express-validator';

import * as controller from "../controllers/user-controller.js";
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { roleMiddle } from '../middlewares/role-middleware.js';

export { router };

const router = new Router();

router.post('/singUp',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 16 }),
    controller.singUp)

    .post('/login', controller.login)
    .post('/logout', controller.logout)
    .get('/activate/:link', controller.activate)
    //.get('/refresh', controller.refresh)
    .get('/users', authMiddleware, roleMiddle(['User']), controller.getUsers)
    .delete('/remove-user/:id', authMiddleware, controller.removeUser)
    .put('/edit-user/:id', authMiddleware, controller.editUser);

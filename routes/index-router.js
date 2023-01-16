'use strict';

import { Router } from "express";
import { body } from 'express-validator';

import { UserController } from "../controllers/user-controller.js";
import { authMiddleware } from '../middlewares/auth-middleware.js';

export { router };

const router = new Router();
const controller = new UserController();

router.post('/singUp',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 16 }),
    controller.singUp);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);
router.get('/users', authMiddleware, controller.getUsers);

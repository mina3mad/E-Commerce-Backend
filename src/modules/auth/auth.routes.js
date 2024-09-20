import { Router } from "express";
import * as authController from './controller/auth.controller.js'
import validation from './../../middleware/validation.js';
import { loginSchema, signUpSchema } from "./auth.validation.js";

const authRouter=Router()
authRouter.post('/signUp',validation(signUpSchema),authController.signUp)
            .post('/login',validation(loginSchema),authController.login)
            .get('/confirmEmail/:token',authController.confirmEmail)


export default authRouter            
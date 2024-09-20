import { Router } from "express";
import * as userController from './controller/user.controller.js'
import { authentication } from "../../middleware/auth.js";
import validation from './../../middleware/validation.js';
import { updatePasswordSchema } from "./user.validation.js";
const userRouter=Router()
userRouter.patch('/',authentication,validation(updatePasswordSchema),userController.updatePassword)

export default userRouter
import { Router } from "express";
import * as addressController from './controller/addreess.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';
const addressRouter=Router()
addressRouter.post('/',authentication,authorization([systemRoles.user]),addressController.addAddress)
        .get('/',authentication,authorization([systemRoles.user]),addressController.getAddresses)
        .delete('/:id',authentication,authorization([systemRoles.user]),addressController.deleteAddress)

export default addressRouter 
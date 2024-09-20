import { Router } from "express";
import * as cartController from './controller/cart.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';
const cartRouter=Router()
cartRouter.post('/',authentication,authorization([systemRoles.user]),cartController.addCart)
            .post('/applyCoupon',authentication,authorization([systemRoles.user]),cartController.applyCoupon)
            .get('/',authentication,authorization([systemRoles.user]),cartController.getCart)
        .put('/:id',authentication,authorization([systemRoles.user]),cartController.deleteProduct)
        .put('/updateQuantity/:id',authentication,authorization([systemRoles.user]),cartController.updateQuantity)
        .delete('/',authentication,authorization([systemRoles.user]),cartController.clearCart)

export default cartRouter 
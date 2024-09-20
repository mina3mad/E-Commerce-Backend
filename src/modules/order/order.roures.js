import { Router } from "express";
import * as orderController from './controller/order.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';
const orderRouter=Router()
orderRouter.post('/',authentication,authorization([systemRoles.user]),orderController.addCashOrder)
            .get('/',authentication,authorization([systemRoles.admin]),orderController.getorders)
            .get('/',authentication,authorization([systemRoles.user]),orderController.getuserOrders)
        // .put('/:id',authentication,authorization(['user']),orderController.deleteProduct)
        // .put('/updateQuantity/:id',authentication,authorization(['user']),orderController.updateQuantity)
        .delete('/:id',authentication,authorization([systemRoles.admin]),orderController.deleteOrder)

export default orderRouter 
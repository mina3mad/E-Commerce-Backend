import { Router } from "express";
import * as couponController from './controller/coupon.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { createCouponSchema } from "./coupon.validation.js";
import systemRoles from './../../utiles/systemRoles.js';
const couponRouter=Router()
couponRouter.post('/',authentication,authorization([systemRoles.admin]),validation(createCouponSchema),couponController.addCoupon)
        .get('/',couponController.getCoupons)
        .put('/:id',authentication,authorization([systemRoles.admin]),couponController.updateCoupon)
        .delete('/:id',authentication,authorization([systemRoles.admin]),couponController.deleteCoupon)

export default couponRouter 
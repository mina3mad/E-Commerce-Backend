import { Router } from "express";
import * as whishlistController from './controller/whishlist.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from "../../utiles/systemRoles.js";
const wishlistRouter=Router()
wishlistRouter.post('/',authentication,authorization([systemRoles.user]),whishlistController.addWhishlist)
        .get('/',authentication,authorization([systemRoles.user]),whishlistController.getWhishlist)
        .delete('/',authentication,authorization([systemRoles.user]),whishlistController.deleteWhishlist)

export default wishlistRouter 
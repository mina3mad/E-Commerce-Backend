import { Router } from "express";
import * as reviewController from './controller/review.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';
const reviewRouter=Router()
reviewRouter.post('/',authentication,authorization([systemRoles.user]),reviewController.addReview)
        .get('/',reviewController.getReviews)
        .get('/:id',reviewController.getReview)
        .put('/:id',authentication,authorization([systemRoles.admin,systemRoles.user]),reviewController.updateReview)
        .delete('/:id',authentication,authorization([systemRoles.admin,systemRoles.user]),reviewController.deleteReview)

export default reviewRouter 
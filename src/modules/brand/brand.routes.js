import { Router } from "express";
import * as brandController from './controller/brand.controller.js'
import { customValidation, upload } from "../../middleware/uploadPhoto.js";
import validation from './../../middleware/validation.js';
import { addBrandSchema } from './brand.validation.js';
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';

const brandRouter=Router()
brandRouter.post('/',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'brand').single('image'),validation(addBrandSchema),brandController.addBrand)
    .get('/',brandController.getBrands)
    .get('/:id',brandController.getBrand)
    .put('/:id',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'brand').single('image'),brandController.updateBrand)
    .delete('/:id',authentication,authorization([systemRoles.admin]),brandController.deleteBrand)

export default brandRouter
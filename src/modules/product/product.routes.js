import { Router } from "express";
import * as productController from './controller/product.controller.js'
import { customValidation, upload } from "../../middleware/uploadPhoto.js";
import validation from "../../middleware/validation.js";
import { addProductSchema } from "./product.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';

const productRouter=Router()
productRouter.post('/',authentication,authorization([systemRoles.admin]),upload(customValidation.image).fields([{name:'mainImage',maxCount:1},{name:'coverImages',maxCount:5}]),validation(addProductSchema),productController.addProduct)
    .get('/',productController.getProducts)
    .get('/:id',productController.getProduct)
    .put('/:id',authentication,authorization([systemRoles.admin]),upload(customValidation.image).fields([{name:'mainImage',maxCount:1},{name:'coverImages',maxCount:5}]),productController.updateProduct)
    .delete('/:id',authentication,authorization([systemRoles.admin]),productController.deleteProduct)


export default productRouter
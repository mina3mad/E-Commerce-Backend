import { Router } from "express";
import * as categoryController from './controller/category.controller.js'
import { customValidation, upload } from "../../middleware/uploadPhoto.js";
import subCategoryRouter from './../subCategory/subCategory.routes.js';
import validation from "../../middleware/validation.js";
import { addCategorySchema } from "./category.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';

const categoryRouter=Router()
categoryRouter.post('/',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'category').single('image'),validation(addCategorySchema),categoryController.addCategory)
        .get('/',categoryController.getCategories)
        .get('/:id',categoryController.getCategory)
        .put('/:id',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'category').single('image'),categoryController.updateCategory)
        .delete('/:id',authentication,authorization([systemRoles.admin]),categoryController.deleteCategory)
        .use('/:id/subcategories',subCategoryRouter)


export default categoryRouter 
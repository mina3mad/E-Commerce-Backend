import { Router } from "express";
import * as subCategoryController from './controller/subCategory.controller.js'
import { customValidation, upload } from "../../middleware/uploadPhoto.js";
import validation from './../../middleware/validation.js';
import { addSubCategorySchema } from './subCategory.validation.js';
import { authentication, authorization } from "../../middleware/auth.js";
import systemRoles from './../../utiles/systemRoles.js';

const subCategoryRouter=Router({mergeParams:true})
subCategoryRouter.post('/',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'subCategory').single('image'),validation(addSubCategorySchema),subCategoryController.addSubCategory)
    .get('/',subCategoryController.getSubCategories)
    .get('/:id',subCategoryController.getSubCategory)
    .put('/:id',authentication,authorization([systemRoles.admin]),upload(customValidation.image,'subCategory').single('image'),subCategoryController.updateSubCategory)
    .delete('/:id',authentication,authorization([systemRoles.admin]),subCategoryController.deleteSubCategory)


export default subCategoryRouter
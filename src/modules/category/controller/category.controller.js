import Category from './../../../../database/models/Category.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import deleteOldImage from '../../../utiles/deleteOldImage.js';
import ApiFeatues from './../../../utiles/apiFeatures.js';

export const addCategory=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body
        const slug =name.replaceAll(" ","-")
        const category=await Category.create({name,slug,createdBy:req.user.id,image:req.file?.filename})
        return res.status(201).json({message:'category added successfully',category,status:201})
    }   
)

export const getCategories=asyncHandler(
    async(req,res,next)=>{
        let apiFeatures=new ApiFeatues(Category.find(),req.query)
        apiFeatures=apiFeatures.pagination().sort().fields().search().filter()
        const categories=await apiFeatures.mongooseQuery
        return categories.length==0?next(new AppError('there is no categories yet',404)):
        res.json({message:'categories is:',page:apiFeatures.page,size:apiFeatures.limit,categories,status:200})

    }
)


export const getCategory=asyncHandler(
    async(req,res,next)=>{
        const category=await Category.findById(req.params.id)
        return !category?next(new AppError('category doesnt exist',404)):
        res.json({message:'category is:',category,status:200})
    }
)


export const updateCategory=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body
        const slug =name.replaceAll(" ","-")
        const oldCategory=await Category.findById(req.params.id).lean();
        const oldImagePath = oldCategory.image;

        //delete old photo if user enter a new one
        deleteOldImage(req.file,oldImagePath,'category')
        const category=await Category.findByIdAndUpdate(req.params.id,{name,slug,image:req.file?.filename},{new:true})        
        return !category?next(new AppError('category doesnt exist',404)):
        res.json({message:'category updated successfully',category,status:200})
    }
) 


export const deleteCategory=asyncHandler(
    async(req,res,next)=>{
        const category=await Category.findByIdAndDelete(req.params.id)        
        return !category?next(new AppError('category doesnt exist',404)):
        res.json({message:'category deleted successufully',category,status:200})
    }
) 

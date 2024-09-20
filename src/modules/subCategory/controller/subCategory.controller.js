import SubCategory from './../../../../database/models/SubCategory.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import deleteOldImage from './../../../utiles/deleteOldImage.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';


export const addSubCategory=asyncHandler(
    async(req,res,next)=>{
        const {name,category}=req.body
        const slug =name.replaceAll(" ","-")
        const subcategory=await SubCategory.create({name,slug,createdBy:req.user.id,category,image:req.file?.filename})
        return res.status(201).json({message:'subcategory added successfully',subcategory,status:201})
    }   
)

export const getSubCategories=asyncHandler(
    async(req,res,next)=>{
        let apiFeatures=new ApiFeatues(SubCategory.find({category:req.params.id}),req.query)
        apiFeatures=apiFeatures.pagination().sort().fields().search().filter()
        const subcategories=await apiFeatures.mongooseQuery.populate('category')
        return subcategories.length==0?next(new AppError('there is no subcategories yet',404)):
        res.json({message:'subcategories is:',subcategories,status:200})

    }
)


export const getSubCategory=asyncHandler(
    async(req,res,next)=>{
        const subcategory=await SubCategory.findById(req.params.id).populate('category')
        return !subcategory?next(new AppError('subcategory doesnt exist',404)):
        res.json({message:'subcategory is:',subcategory,status:200})
    }
)

  
export const updateSubCategory=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body
        req.body.slug=name.replaceAll(" ","-")
        req.body.image=req.file?.filename
        
        const oldSubCategory=await SubCategory.findById(req.params.id).lean();
        const oldImagePath = oldSubCategory.image;

        //delete old photo if user enter a new one
        deleteOldImage(req.file,oldImagePath,'subCategory')
        const subcategory=await SubCategory.findByIdAndUpdate(req.params.id,req.body,{new:true})        
        return !subcategory?next(new AppError('subcategory doesnt exist',404)):
        res.json({message:'subcategory updated successfully',subcategory,status:200})
    }
) 


export const deleteSubCategory=asyncHandler(
    async(req,res,next)=>{
        const subcategory=await SubCategory.findByIdAndDelete(req.params.id)        
        return !subcategory?next(new AppError('subcategory doesnt exist',404)):
        res.json({message:'subcategory deleted successufully',subcategory,status:200})
    }
) 

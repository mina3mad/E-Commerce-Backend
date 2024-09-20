import Brand from './../../../../database/models/Brand.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import deleteOldImage from '../../../utiles/deleteOldImage.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';


export const addBrand=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body
        const slug =name.replaceAll(" ","-")
        const brand=await Brand.create({name,slug,createdBy:req.user.id,image:req.file?.filename})
        return res.status(201).json({message:'brand added successfully',brand,status:201})
    }   
)

export const getBrands=asyncHandler(
    async(req,res,next)=>{
        let apiFeatures=new ApiFeatues(Brand.find(),req.query)
        apiFeatures=apiFeatures.pagination().sort().fields().search().filter()
        const brands=await apiFeatures.mongooseQuery
        return brands.length==0?next(new AppError('there is no brands yet',404)):
        res.json({message:'brands is:',brands,status:200})

    }
)


export const getBrand=asyncHandler(
    async(req,res,next)=>{
        const brand=await Brand.findById(req.params.id)
        return !brand?next(new AppError('brand doesnt exist',404)):
        res.json({message:'brand is:',brand,status:200})
    }
)


export const updateBrand=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body
        const slug =name.replaceAll(" ","-")
        const oldBrand=await Brand.findById(req.params.id).lean();
        const oldImagePath = oldBrand.image;

        //delete old photo if user enter a new one
        deleteOldImage(req.file,oldImagePath,'brand')
        const brand=await Brand.findByIdAndUpdate(req.params.id,{name,slug,image:req.file?.filename},{new:true})        
        return !brand?next(new AppError('brand doesnt exist',404)):
        res.json({message:'brand updated successfully',brand,status:200})
    }
) 


export const deleteBrand=asyncHandler(
    async(req,res,next)=>{
        const brand=await Brand.findByIdAndDelete(req.params.id)        
        return !brand?next(new AppError('brand doesnt exist',404)):
        res.json({message:'brand deleted successufully',brand,status:200})
    }
) 

import SubCategory from './../../../../database/models/SubCategory.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import  { deleteOldCloudinaryImage } from './../../../utiles/deleteOldImage.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';
import cloudinary from './../../../utiles/cloudinary.js';


export const addSubCategory=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body

        //check if the subCategoty name exist before
        const subCategoryExist=await SubCategory.findOne({name})
        if(subCategoryExist){
            return next(new AppError("subcategory already exist",409))
        }

        req.body.slug =name.replaceAll(" ","-")
        req.body.createdBy=req.user.id
        
        //check if there is file to upload
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/subCategory',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }
        const subCategory=await SubCategory.create(req.body)
        
        //check if any error happen while creating in database
        if(!subCategory&&req.file){
            await deleteOldCloudinaryImage(req.body.image.public_id)
        }

        return res.status(201).json({message:'subcategory added successfully',subCategory,status:201})
    }   
)

export const getSubCategories=asyncHandler(
    async(req,res,next)=>{
        let apiFeatures=new ApiFeatues(SubCategory.find(),req.query)
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
        // req.body.image=req.file?.filename
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/subCategory',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }
        
        const oldSubCategory=await SubCategory.findById(req.params.id);
        //delete old photo if admin enter a new one
        if (oldSubCategory?.image && oldSubCategory?.image?.public_id && req.file) {
            await deleteOldCloudinaryImage(oldSubCategory.image.public_id);
        }

        const subcategory=await SubCategory.findByIdAndUpdate(req.params.id,req.body,{new:true})  
        if(!subcategory){
            if(req.file){
                await deleteOldCloudinaryImage(req.body.image.public_id)
            }
            return next(new AppError('subcategory doesnt exist',404))
        }      
        return res.json({message:'subcategory updated successfully',subcategory,status:200})
    }
) 


export const deleteSubCategory=asyncHandler(
    async(req,res,next)=>{
        const subcategory=await SubCategory.findByIdAndDelete(req.params.id)        
        return !subcategory?next(new AppError('subcategory doesnt exist',404)):
        res.json({message:'subcategory deleted successufully',subcategory,status:200})
    }
) 

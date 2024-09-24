import Category from './../../../../database/models/Category.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import ApiFeatues from './../../../utiles/apiFeatures.js';

export const addCategory=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body

        //check if the category name exist before
        const categoryExist=await Category.findOne({name})
        if(categoryExist){
            return next(new AppError("category already exist",409))
        }

        //check if there is file to upload
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/category',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }

        req.body.slug =name.replaceAll(" ","-")
        req.body.createdBy=req.user.id


        const category=await Category.create(req.body)
        //check if any error happen while creating in database
        if(!category&&req.file){
            await deleteOldCloudinaryImage(req.body.image.public_id)
        }
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
        req.body.slug =name.replaceAll(" ","-")


        const oldCategory=await Category.findById(req.params.id);
        if (!oldCategory) {
            return next(new AppError('category does not exist', 404));
        }

        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/category',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }
        const category=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true})   
        if(category){
            if (oldCategory.image && oldCategory.image?.public_id && req.file) {
                await deleteOldCloudinaryImage(oldCategory.image.public_id);
            }
        }
        if(!category){
            return next(new AppError('category doesnt exist',404))
        }     
        return res.json({message:'category updated successfully',category,status:200})
    }
) 


export const deleteCategory=asyncHandler(
    async(req,res,next)=>{
        const category=await Category.findByIdAndDelete(req.params.id)        
        return !category?next(new AppError('category doesnt exist',404)):
        res.json({message:'category deleted successufully',category,status:200})
    }
) 

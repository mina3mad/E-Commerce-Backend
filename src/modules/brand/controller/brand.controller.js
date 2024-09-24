import Brand from './../../../../database/models/Brand.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';


export const addBrand=asyncHandler(
    async(req,res,next)=>{
        const {name}=req.body


        //check if the brand name exist before
        const brandExist=await Brand.findOne({name})
        if(brandExist){
            return next(new AppError("brand already exist",409))
        }


        req.body.slug =name.replaceAll(" ","-")
        req.body.createdBy =req.user.id


        //check if there is file to upload
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/brand',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }
        const brand=await Brand.create(req.body)

        //check if any error happen while creating in database
        if(!brand&&req.file){
            await deleteOldCloudinaryImage(req.body.image.public_id)
        }
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
        req.body.slug=name.replaceAll(" ","-")
        // req.body.image=req.file?.filename
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
                folder:'uploads/subCategory',
                use_filename:true
            })
            req.body.image={ secure_url, public_id }
        }
        const oldBrand=await Brand.findById(req.params.id);

         //delete old photo if admin enter a new one
         if (oldBrand?.image && oldBrand?.image?.public_id && req.file) {
            await deleteOldCloudinaryImage(oldBrand.image.public_id);
        }

        const brand=await Brand.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!brand){
            if(req.file){
                await deleteOldCloudinaryImage(req.body.image.public_id)
            }
            return next(new AppError('brand doesnt exist',404))
        }        
        return res.json({message:'brand updated successfully',brand,status:200})
    }
) 


export const deleteBrand=asyncHandler(
    async(req,res,next)=>{
        const brand=await Brand.findByIdAndDelete(req.params.id)        
        return !brand?next(new AppError('brand doesnt exist',404)):
        res.json({message:'brand deleted successufully',brand,status:200})
    }
) 

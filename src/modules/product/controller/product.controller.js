import Product from './../../../../database/models/Product.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import deleteOldImage from './../../../utiles/deleteOldImage.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';



export const addProduct=asyncHandler(
    async(req,res,next)=>{
        const {title}=req.body
        if(req.files?.mainImage?.length){
            req.body.mainImage=req.files.mainImage[0].filename
        }
        
        req.body.coverImages=req.files?.coverImages?.map((element)=>element.filename)
        
        req.body.slug=title.replaceAll(" ","-")
        req.body.createdBy=req.user.id
        const product=await Product.create(req.body)
        return res.status(201).json({message:'product added successfully',product,status:201})
    }   
)

export const getProducts=asyncHandler(
    async(req,res,next)=>{
        let apiFeatures=new ApiFeatues(Product.find(),req.query)
        apiFeatures=apiFeatures.pagination().sort().fields().search().filter()
        const products=await apiFeatures.mongooseQuery.populate([
            {path:'category'},
            {path:'subCategory'},
            {path:'brand'},
        ])
        return products.length==0?next(new AppError('there is no products yet',404)):
        res.json({message:'products is:',page:apiFeatures.page,size:apiFeatures.limit,products,status:200})

    }
)


export const getProduct=asyncHandler(
    async(req,res,next)=>{
        const product=await Product.findById(req.params.id).populate([
            {path:'category'},
            {path:'subCategory'},
            {path:'brand'},
        ])
        return !product?next(new AppError('product doesnt exist',404)):
        res.json({message:'product is:',product,status:200})
    }
)

  
export const updateProduct=asyncHandler(
    async(req,res,next)=>{
        const {title}=req.body
        req.body.slug=title.replaceAll(" ","-")
        if(req.files?.mainImage?.length){
            req.body.mainImage=req.files?.mainImage[0]?.filename

        }

        req.body.coverImages=req.files?.coverImages?.map((element)=>element.filename)
        const oldProduct=await Product.findById(req.params.id).lean();
        const oldImagePath = oldProduct.mainImage;

        //delete old photo if user enter a new one
        deleteOldImage(req.files.mainImage,oldImagePath,'product')
        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})        
        return !product?next(new AppError('product doesnt exist',404)):
        res.json({message:'product updated successfully',product,status:200})
    }
) 


export const deleteProduct=asyncHandler(
    async(req,res,next)=>{
        const product=await Product.findByIdAndDelete(req.params.id)        
        return !product?next(new AppError('product doesnt exist',404)):
        res.json({message:'product deleted successufully',product,status:200})
    }
) 

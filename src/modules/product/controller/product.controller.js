import Product from './../../../../database/models/Product.js';
import AppError from '../../../utiles/Error.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import ApiFeatues from '../../../utiles/apiFeatures.js';
import cloudinary from '../../../utiles/cloudinary.js';



export const addProduct=asyncHandler(
    async(req,res,next)=>{
        const {title}=req.body
        //check if the product name exist before
        const productExist=await Product.findOne({title})
        if(productExist){
            return next(new AppError("product already exist",409))
        }


        let ids=[]
        //main image upload 
        if(req.files?.mainImage?.length){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{
                folder:'uploads/product/mainImage',
                use_filename:true
            })
            ids.push(public_id)
            req.body.mainImage={ secure_url, public_id }
        }
        
        let listArray=[]
        //cover images upload
        if(req.files?.coverImages?.length){
        for (const image of req.files.coverImages) {
            const{secure_url,public_id}=await cloudinary.uploader.upload(image.path,{
                folder:'uploads/product/coverImages',
                use_filename:true
            })
            listArray.push({ secure_url, public_id })
            ids.push(public_id)
            }
            req.body.coverImages=listArray
        }

        // req.body.coverImages=req.files?.coverImages?.map((element)=>element.filename)
        
        req.body.slug=title.replaceAll(" ","-")
        req.body.createdBy=req.user.id
        const product=await Product.create(req.body)

        //check if any error happen while creating in database
        if(!product&&req.files){
            await cloudinary.api.delete_resources(ids)
        }
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
        // Fetch the existing product to delete old images later
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
        return next(new AppError('Product does not exist', 404));
        }

        req.body.slug=title.replaceAll(" ","-")
        

        let ids=[]
        //update main image 
        if(req.files?.mainImage?.length){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{
                folder:'uploads/product/mainImage',
                use_filename:true
            })
            ids.push(public_id)
            req.body.mainImage={ secure_url, public_id }
            
        }

        
        let listArray=[]
        //update cover Images
        if(req.files?.coverImages?.length){
        for (const image of req.files.coverImages) {
            const{secure_url,public_id}=await cloudinary.uploader.upload(image.path,{
                folder:'uploads/product/coverImages',
                use_filename:true
            })
            listArray.push({ secure_url, public_id })
            ids.push(public_id)
            }
            req.body.coverImages=listArray
            
        }


        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
        //delete old photos only after successful upload of the new ones
        if(updateProduct){
            // Delete old main image from Cloudinary
            if (existingProduct.mainImage?.public_id) {
                await cloudinary.uploader.destroy(existingProduct.mainImage.public_id);
                }
            // Delete old cover images from Cloudinary
            if (existingProduct.coverImages?.length) {
                for (const oldImage of existingProduct.coverImages) {
                    if (oldImage.public_id) {
                    await cloudinary.uploader.destroy(oldImage.public_id);
                    }
                }
                }
        }   
        if(!updateProduct){
            if(req.file){
                await cloudinary.api.delete_resources(ids)
            }
            return next(new AppError('product doesnt exist',404))
        }     
        return res.json({message:'product updated successfully',updatedProduct,status:200})
    }
) 


export const deleteProduct=asyncHandler(
    async(req,res,next)=>{
        const product=await Product.findByIdAndDelete(req.params.id)        
        return !product?next(new AppError('product doesnt exist',404)):
        res.json({message:'product deleted successufully',product,status:200})
    }
) 

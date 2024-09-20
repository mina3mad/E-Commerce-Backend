import Review from './../../../../database/models/Review.js';
import asyncHandler from './../../../middleware/asyncHandler.js';
import AppError from '../../../utiles/Error.js';



export const addReview=asyncHandler(
    async(req,res,next)=>{
        req.body.createdBy=req.user.id
        const reviewExist=await Review.find({product:req.body.product,createdBy:req.user.id})
        if(reviewExist.length){
            return next(new AppError('you are already reviewed this product',400))
        }
        const review=await Review.create(req.body)
        return res.status(201).json({message:'review added successfully',review,status:201})
    }   
)

export const getReviews=asyncHandler(
    async(req,res,next)=>{
        const reviews=await Review.find().populate('createdBy')
        return reviews.length==0?next(new AppError('there is no reviews yet',404)):
        res.json({message:'reviews is:',reviews,status:200})

    }
)


export const getReview=asyncHandler(
    async(req,res,next)=>{
        const review=await Review.findById(req.params.id)
        return !review?next(new AppError('review doesnt exist',404)):
        res.json({message:'review is:',review,status:200})
    }
)


export const updateReview=asyncHandler(
    async(req,res,next)=>{
        const exist=await Review.findById(req.params.id)
        //if review doesnt exist
        if(!exist){
            return next(new AppError('review not found!',404))
        }
        //check if this user he is made this review
        if(exist.createdBy==req.user.id || req.user.role=='admin'){
            const review=await Review.findByIdAndUpdate(req.params.id,req.body,{new:true})        
            return !review?next(new AppError('review doesnt exist',404)):
            res.json({message:'review updated successfully',review,status:200})
        }

        return next(new AppError('you are not authorized to update this review',400))
    }
) 


export const deleteReview=asyncHandler(
    async(req,res,next)=>{
        const exist=await Review.findById(req.params.id)
        //if review doesnt exist
        if(!exist){
            return next(new AppError('review not found!',404))
        }
        //check if this user he is made this review
        if(exist.createdBy==req.user.id || req.user.role=='admin'){
        const review=await Review.findByIdAndDelete(req.params.id)        
        return !review?next(new AppError('review doesnt exist',404)):
        res.json({message:'review deleted successufully',review,status:200})
        }
        return next(new AppError('you are not authorized to delete this review',400))
    }
) 

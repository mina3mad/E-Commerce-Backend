import User from "../../../../database/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from './../../../utiles/Error.js';



export const addWhishlist=asyncHandler(
    async(req,res,next)=>{
        const whishlist=await User.findByIdAndUpdate(req.user.id,{$addToSet:{wishList:req.query.product}},{new:true})
        return !whishlist?next(new AppError('whishlist doesnt exist',404)):
        res.status(201).json({message:'whishlist added successfully',whishlist,status:201})
    }   
)

export const getWhishlist=asyncHandler(
    async(req,res,next)=>{
        const user=await User.findById(req.user.id).populate('wishList')
        return !user?next(new AppError('there is no whishlist yet',404)):
        res.json({message:'success','whishlist is':user.wishList,status:200})

    }
)




export const deleteWhishlist=asyncHandler(
    async(req,res,next)=>{
        const whishlist=await User.findByIdAndUpdate(req.user.id,{$pull:{wishList:req.query.product}},{new:true})
        return !whishlist?next(new AppError('product is not found!',404)):
        res.json({message:'product deleted from whishlist',whishlist,status:200})
    }
) 

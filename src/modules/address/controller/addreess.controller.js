import User from "../../../../database/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from './../../../utiles/Error.js';



export const addAddress=asyncHandler(
    async(req,res,next)=>{
        const address=await User.findByIdAndUpdate(req.user.id,{$push:{address:req.query}},{new:true})
        return !address?next(new AppError('address doesnt exist',404)):
        res.status(201).json({message:'address added successfully',address,status:201})
    }   
)

export const getAddresses=asyncHandler(
    async(req,res,next)=>{
        const user=await User.findById(req.user.id)
        return !user?next(new AppError('there is no addresses yet',404)):
        res.json({message:'success','addresses is:':user.address,status:200})

    }
)




export const deleteAddress=asyncHandler(
    async(req,res,next)=>{
        const address=await User.findByIdAndUpdate(req.user.id,{$pull:{address:{_id:req.params.id}}},{new:true})
        return !address?next(new AppError('product is not found!',404)):
        res.json({message:'address is deleted',address,status:200})
    }
) 

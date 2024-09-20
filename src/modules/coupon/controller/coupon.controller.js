import Coupon from './../../../../database/models/Coupon.js';
import asyncHandler from '../../../middleware/asyncHandler.js';
import AppError from '../../../utiles/Error.js';


export const addCoupon=asyncHandler(async(req,res,next)=>{
    const exist=await Coupon.findOne({code:req.body.code})
    if(exist) return next(new AppError('coupon already exist',400))
        req.body.code=req.body.code.toLowerCase()
    const coupon=await Coupon.create(req.body)
    return res.status(201).json({message:"coupon created successfully",coupon,status:201})
})


export const getCoupons=asyncHandler(async(req,res,next)=>{
    const coupons=await Coupon.find()
    return !coupons.length?next(new AppError('there is no coupons yet',404)):
        res.json({message:"coupon created successfully",coupons,status:200})
})

export const updateCoupon=asyncHandler(async(req,res,next)=>{
    const coupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true})
    return !coupon?next(new AppError('coupon not found',404)):
        res.json({message:"coupon updated successfully",coupon,status:200})

})



export const deleteCoupon=asyncHandler(async(req,res,next)=>{
    const coupon=await Coupon.findByIdAndDelete(req.params.id)
    return !coupon?next(new AppError('coupon not found',404)):
        res.json({message:"coupon deleted successfully",coupon,status:200})

})
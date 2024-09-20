import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utiles/Error.js";
import User from './../../../../database/models/User.js';
import bcryptjs from 'bcryptjs'

export const updatePassword=asyncHandler(async(req,res,next)=>{
    const{oldPass,newPass}=req.body
    const user=await User.findById(req.user.id)
    const match=bcryptjs.compareSync(oldPass,user.password)
    if(match){
        const hashPass=bcryptjs.hashSync(newPass,process.env.SALT_ROUNDS)
        await user.updateOne({password:hashPass,passwordChangedTime:new Date()},{new:true})
        return res.json({message:'password changed',user,status:200})
    }
    return next(new AppError("the old password is wrong",400))
})
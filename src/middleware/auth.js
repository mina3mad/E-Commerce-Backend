import  jwt  from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import AppError from '../utiles/Error.js';
import User from '../../database/models/User.js';

export const authentication=asyncHandler(async(req,res,next)=>{
    const authorization=req.headers.authorization
    if(!authorization){
        return next(new AppError('unauthorized',401))
    }
        const token=authorization.split(' ')[1]
        const payload=jwt.verify(token,process.env.TOKEN_KEY)
        if(!payload){
            return next(new AppError('invalid payload',400))
        }
        const user=await User.findById(payload.id)
        if(!user){
        return next(new AppError('unauthorized',401))
        }
        if(!user.passwordChangedTime){
            req.user=payload
            return next()
        }
        const time=parseInt(user?.passwordChangedTime?.getTime()/1000)
        // console.log(time);
        // console.log(payload.iat);
        
        if(time>payload.iat){
            return next(new AppError('unauthorized please login',401))
        }
        req.user=payload
        next()
})

export const authorization=(roles)=>{
    return asyncHandler(async(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('forbidden',401))
        }
        next()
    })
}
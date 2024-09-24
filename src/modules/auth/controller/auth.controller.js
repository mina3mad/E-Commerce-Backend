import User from '../../../../database/models/User.js';
import bcryptjs from 'bcryptjs'
import  jwt  from 'jsonwebtoken';
import asyncHandler from './../../../middleware/asyncHandler.js';
import AppError from '../../../utiles/Error.js';
import sendEmail from './../../../utiles/sendEmail.js';
// import {customAlphabet} from 'nanoid';

export const signUp=asyncHandler(
    async (req,res,next)=>{
        const {name,email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
            req.body.password=bcryptjs.hashSync(password,saltRounds)
            // const code=customAlphabet('0123456789',4)
            // req.body.OTP=code()
            const newUser=await User.create(req.body)

            const token=jwt.sign({email},process.env.TOKEN_EMAIL_VERIFICATION,{expiresIn:60*3})
            const link=`http://localhost:3000/api/v1/auth/confirmEmail/${token}`
            sendEmail({to:email,userName:name,link:`<a href='${link}'>confirm your email</a>`})
            return res.status(201).json({message:"user is created",newUser})
        }
        return next(new AppError("email already exists!",409)) 
        }
)


export const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        return next(new AppError("invalid email or password",400))  
    }
    if(!user.confirmEmail){
        return next(new AppError("please confirm email",400))

    }
    const match=bcryptjs.compareSync(password,user.password)
    // return match ?res.json({message:"login successfully",userExist}) :res.status(400).json({message:"invalid email or password"})  
        if(!match){
            return next(new AppError("invalid email or password",400)) 
        }
        const token=jwt.sign({id:user.id,role:user.role},process.env.TOKEN_KEY)
        return res.json({message:"login successfully",token})
    
})



export const confirmEmail=asyncHandler(async(req,res,next)=>{
    const{token}=req.params
    const payload=jwt.verify(token,process.env.TOKEN_EMAIL_VERIFICATION)

    if(!payload.email){
        return next(new AppError("invalid payload or token has expired",400)) 
    }
    const user=await User.findOneAndUpdate({email:payload.email,confirmEmail:false},{confirmEmail:true },{new:true})
    if(!user){
        return next(new AppError('user not found or you are already confirmed',400))
    }
    return res.json({message:"email confirmed"})   

})
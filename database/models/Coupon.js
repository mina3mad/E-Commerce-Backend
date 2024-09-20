import mongoose from "mongoose";
const couponSchema=new mongoose.Schema(
    {
        code:{
            type:String,
            required:[true,'code is required'],
            minLength:3,
            maxLength:30,
            trim:true,
            lowercase:true,
            unique:[true,'code is unique']
        },
        expire:{
            type:Date,
            required:[true,"expiration date is required"]
        },
        discount:{
            type:Number,
            required:[true,"discount is required"],
            min:1,
            max:100,
        },
        usedBy:[{
            type:mongoose.Types.ObjectId,
            ref:'User'
        }]
    },{
        timestamps:true,
        versionKey:false
    }
)

const Coupon=mongoose.model('Coupon',couponSchema)
export default Coupon
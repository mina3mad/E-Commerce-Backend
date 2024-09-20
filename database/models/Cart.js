import mongoose from "mongoose";
const cartSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true,
            unique:true
        },
        products:[{
            product:{
                type:mongoose.Types.ObjectId,
                ref:"Product",
                required:true,
                unique:true
            },
            title:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true,
                min:0
            }
        }],
        subTotal:{
            type:Number,
            min:0
        },
        discount:{
            type:Number,
            default:0
        },
        total:{
            type:Number,
            min:0
        },
    },{
        timestamps:true,
        versionKey:false
    }
)

const Cart=mongoose.model('Cart',cartSchema)
export default Cart
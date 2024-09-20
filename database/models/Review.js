import mongoose from "mongoose";
const reviewSchema=new mongoose.Schema({
    content:{
        type:String,
        required:[true,'content is required'],
        minLength:[3,'minimum length is 3 characters'],
        maxLength:[500,'maximum length is 3 characters'],
    },
    product:{
        type:mongoose.Types.ObjectId,
        required:[true,"product is required"],
        ref:'Product'
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:[true,'createdBy is required'],
        ref:'User'
    }
    
},{
    timestamps:true,
    versionKey:false
}
)

const Review=mongoose.model('Review',reviewSchema)
export default Review
import mongoose  from "mongoose";

const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,'name is required'],
    unique:[true,'name must be unique'],
    minLength:[2,'minimum length is 2 characters'],
    manLength:[25,'maximum length is 25 characters']
},
email:{
    type:String,
    required:[true,'email is required']
},
password:{
    type:String,
    required:[true,'password is required'],
},
passwordChangedTime:Date,
role:{
    type:String,
    enum:['user','admin'],
    default:'user'
},
confirmEmail:{
    type:Boolean,
    default:false
},
wishList:[{
    type:mongoose.Types.ObjectId,
    ref:"Product"
}],
address:[{
    city:String,
    street:String
}]
},
{
    timestamps:true,
    versionKey:false
})

const User=mongoose.model('User',userSchema)
export default User
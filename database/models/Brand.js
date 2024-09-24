import mongoose from "mongoose";

const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:[true,'name must be unique'],
        trim:true,
        minLength:[2,'min length is 2 character'],
        maxLength:[25,'max length is 25 character']
    },
    slug:{
        type:String,
        required:[true,'name is required'],
        lowerCase:true
    },
    image:{
        secure_url:String,
        public_id:String
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required:[true,'createdBy is required'],
        ref:'User'
    },
    updatedBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true,
    versionKey:false
})

brandSchema.post('init',(doc)=>{
    if(doc.image){
        doc.image='http://localhost:3000/uploads/brand/'+doc.image
    }
})

const Brand=mongoose.model('Brand',brandSchema)
export default Brand
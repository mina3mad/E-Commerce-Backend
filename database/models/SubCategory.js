import mongoose from "mongoose";

const subCategorySchema=new mongoose.Schema({
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
    category:{
        type:mongoose.Types.ObjectId,
        required:[true,"category is required"],
        ref:'Category'
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

// subCategorySchema.post('init',(doc)=>{
//     if(doc.image){
//         doc.image='http://localhost:3000/uploads/subCategory/'+doc.image
//     }
// })

const SubCategory=mongoose.model('SubCategory',subCategorySchema)
export default SubCategory
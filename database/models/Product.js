import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'name is required'],
        unique:[true,'name must be unique'],
        trim:true,
        minLength:[2,'min length is 2 character'],
        maxLength:[25,'max length is 25 character']
    },
    description:{
        type:String,
        required:[true,'description is required'],
        trim:true,
        minLength:[3,'min length is 3 character'],
        maxLength:[1500,'max length is 1500 character']
    },
    slug:{
        type:String,
        required:[true,'name is required'],
        lowerCase:true
    },
    mainImage:{
        secure_url:String,
        public_id:String
    },
    coverImages:[{
        secure_url:String,
        public_id:String
    }],
    price:{
        type:Number,
        required:[true,'price is required'],
        minLength:[0,'minimum price is 0']
    },
    priceAfterDiscount:{
        type:Number,
        minLength:[0,'minimum price is 0']
    },
    stock:{
        type:Number,
        required:[true,'stock is required'],
        min:0
    },
    sold:{
        type:Number,
        minLength:[0,'minimum sold is 0'],
        default:0
    },
    rateCount:{
        type:Number,
        minLength:[0,'minimum rateCount is 0'],
        default:0
    },
    rateAvg:{
        type:Number,
        minLength:[0,'minimum rateAverage is 0'],
        default:0
    },
    category:{
        type:mongoose.Types.ObjectId,
        required:[true,"category is required"],
        ref:'Category'
    },
    subCategory:{
        type:mongoose.Types.ObjectId,
        required:[true,"subcategory is required"],
        ref:'SubCategory'
    },
    brand:{
        type:mongoose.Types.ObjectId,
        required:[true,"brand is required"],
        ref:'Brand'
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
    versionKey:false,
    toJSON:{virtuals:true}
})

productSchema.post('init',(doc)=>{
    if(doc?.mainImage){
        doc.mainImage='http://localhost:3000/uploads/product/'+doc.mainImage
    }
    if(doc?.coverImages?.length){
        doc.coverImages=doc?.coverImages.map((element)=>'http://localhost:3000/uploads/product/'+element
)}
});

productSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"product"
});

productSchema.pre(/^find/,function(){
    this.populate("reviews")
})

const Product=mongoose.model('Product',productSchema)
export default Product
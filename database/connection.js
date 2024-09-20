import mongoose from "mongoose";
const dbConnect=()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Db connected");
        
    }).catch(()=>{
        console.log("Db failed");
    })
}
export default dbConnect
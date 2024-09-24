import fs from 'fs'
import path from 'path';
// import asyncHandler from './asyncHandler.js';



const validation=(schema)=>{
    return (req,res,next)=>{
            const inputData={...req.body,
            ...req.params,
            ...req.query}
        if(req.file){
            inputData.file={...req.file}
        }
        if(req.files){
            inputData.files={...req.files}
        } 
        
        const {error}=schema.validate(inputData,{abortEarly:false})
        if(error){
            //handle single file upload
            // if (req.file) {    //to handle if any error in validation delete the photo that uploaded
            //     fs.unlink(path.join(path.resolve(), req.file.path), (err) => {
            //         if (err)
            //         return res.status(500).json({ error: 'Error deleting file after validation failure' });
            //         // else{
            //         //     console.log("photo deleted successfully");
            //         // }
            //     });
            // }

            //handle multiple files  upload
            // if (req.files && Object.keys(req.files).length > 0) {
            //     // Loop through all files in req.files and delete each one
            //     Object.values(req.files).flat().forEach((file) => {
            //         fs.unlink(path.join(path.resolve(), file.path), (err) => {
            //             if (err) {
            //                 return res.status(500).json({ error: 'Error deleting files after validation failure' });
            //             } 
            //             // else {
            //             //     console.log("Multiple files deleted successfully after validation failure");
            //             // }
            //         });
            //     });
            // }
        
            
            return res.status(400).json({message:"validation error",error:error.details})
        
        }
        return next()
    }
}

export default validation



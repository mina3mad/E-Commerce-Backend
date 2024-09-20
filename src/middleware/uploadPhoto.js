import multer from "multer";
import { nanoid } from "nanoid";
import fs from 'fs'
import AppError from "./../utiles/Error.js";


export const customValidation={
    image:['image/jpeg','image/jpg','image/png'],
    video:["video/mp4"]
}

export const upload=(customValidation,folderName)=>{
    if(!fs.existsSync(`./uploads/${folderName}`)){
      fs.mkdirSync(`./uploads/${folderName}`,{ recursive: true },(err) => {
        if (err) throw new AppError("Failed to create directory", 500);
    })
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
  
          cb(null, nanoid(30)+'-'+file.originalname)
        }
      })
    const fileFilter=(req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new ErrorApp("invalid photo format",400))
        }
    }  
    
    const upload = multer({storage,fileFilter })

    return upload
}
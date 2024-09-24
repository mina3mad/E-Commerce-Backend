import cloudinary from "./cloudinary.js"


// delete old image from cloudinary when update with a new one

export const deleteOldCloudinaryImage=async(public_id)=>{ 
        await cloudinary.uploader.destroy(public_id)
}   

// delete old image from server when update with a new one
// const deleteOldImage=(file,oldImagePath,folderName)=>{
//     if (file&&oldImagePath) {  
//         fs.unlink(path.join(path.resolve(),'uploads',folderName, oldImagePath), (err) => {
//             if (err)
//                 console.error('Error deleting old image file:', err);
//             else{
//                 console.log("Old image deleted successfully");
//             }
//         });
//     }
// }   

// const deleteOldImage = async (file, oldImagePath, folderName) => {
//     if (file && oldImagePath) {
//         const fullPath = path.join(path.resolve(), 'uploads', folderName, oldImagePath);

//         try {
//             await fs.promises.unlink(fullPath);
//             console.log("Old image deleted successfully.");
//         } catch (error) {
//             console.error('Error deleting old image file:', error);
//         }
//     }
// };


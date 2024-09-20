
const globalError=(err,req,res,next)=>{   //global error middleware
    res.status(err.status).json({message:err.message,status:err.status})
}

export default globalError
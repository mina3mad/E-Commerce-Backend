import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import bootstrap from './src/bootstrap.js'
const app = express()
app.use(cors())
app.get('/',(req,res)=>{
    res.status(200).json({message:"hello on my project"})
})
dotenv.config()
bootstrap(app,express)
const port = process.env.PORT||3001
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


import dbConnect from '../database/connection.js'
// import dotenv from 'dotenv';
import categoryRouter from './modules/category/category.routes.js';
import subCategoryRouter from './modules/subCategory/subCategory.routes.js';
import brandRouter from './modules/brand/brand.routes.js';
import productRouter from './modules/product/product.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/user/user.routes.js';
import reviewRouter from './modules/Review/review.routes.js';
import wishlistRouter from './modules/whishlist/whishlist.routes.js';
import addressRouter from './modules/address/address.routes.js';
import couponRouter from './modules/coupon/coupon.routes.js';
import cartRouter from './modules/cart/cart.routes.js';
import orderRouter from './modules/order/order.roures.js';
import globalError from './middleware/globalError.js';

const bootstrap=(app,express)=>{
    const baseUrl='/api/v1'
    // dotenv.config()
    dbConnect()
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))
    app.use(`${baseUrl}/categories`,categoryRouter)
    app.use(`${baseUrl}/subCategories`,subCategoryRouter)
    app.use(`${baseUrl}/brands`,brandRouter)
    app.use(`${baseUrl}/products`,productRouter)
    app.use(`${baseUrl}/auth`,authRouter)
    app.use(`${baseUrl}/user`,userRouter)
    app.use(`${baseUrl}/reviews`,reviewRouter)
    app.use(`${baseUrl}/whishlist`,wishlistRouter)
    app.use(`${baseUrl}/address`,addressRouter)
    app.use(`${baseUrl}/coupons`,couponRouter)
    app.use(`${baseUrl}/cart`,cartRouter)
    app.use(`${baseUrl}/order`,orderRouter)
    app.use('*',(req,res,next)=>{
        res.json({message:"url not found"})
    })
    app.use(globalError)
}
export default bootstrap
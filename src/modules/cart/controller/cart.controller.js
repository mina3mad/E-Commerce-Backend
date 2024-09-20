import Cart from './../../../../database/models/Cart.js';
import Product from './../../../../database/models/Product.js';
import Coupon from './../../../../database/models/Coupon.js';


import asyncHandler from '../../../middleware/asyncHandler.js';
import AppError from '../../../utiles/Error.js';


async function calc(cart){
        const subtotal=cart.products.reduce((prev,element)=>prev+=element.price*element.quantity,0)
        cart.subTotal=subtotal
        if(!cart.discount){
            cart.total=subtotal
        }
        const total=subtotal-(subtotal*cart.discount/100)
        cart.total=total
        await cart.save()    

}


export const addCart=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOne({user:req.user.id})
    if(!cart){ //cart doesnt exist
        //create cart
        const myCart=new Cart({user:req.user.id})
        const newCart=await myCart.save()
        //add product
        const product= await Product.findById(req.body.product)
        if(!product){
            return next(new AppError('not found product ',404))
        }
        req.body.title=product.title
        req.body.price=product.priceAfterDiscount
        
        if(product.stock<req.body.quantity){
            return next(new AppError('product out of stock',400))
        }
        const addToCart=await Cart.findOneAndUpdate({user:req.user.id},{
            $push:{products:req.body}
            },{new:true})
            // let subTotal = 0;
        // addToCart.products.forEach(element => {
        //     subTotal += element.price * element.quantity;
        // });
        // req.body.subTotal = subTotal;
        calc(addToCart)
        return res.status(201).json({message:"done",addToCart,status:201})

    }else{//cart already exist
        const product= await Product.findById(req.body.product)
        if(!product){
            return next(new AppError('not found product ',404))
        } 

        req.body.title=product.title
        req.body.price=product.priceAfterDiscount
        
        if(product.stock<req.body.quantity){
            return next(new AppError('product out of stock',400))
        }

        let productExist=false
        cart.products.forEach(async(pro)=>{
            if(pro.product==req.body.product){
                productExist=true
                if(product.stock<req.body.quantity+pro.quantity){
                    return next(new AppError('product out of stock',400))
                }
                pro.quantity=req.body.quantity+pro.quantity
                // cart.subTotal=cart.products.reduce((prev,element)=>prev+=element.price*element.quantity,0)
                await cart.save()
                calc(cart)
                return res.status(200).json({message:"Product quantity updated in cart",cart,status:200})
            }

        })

        if(!productExist){
            const addToCart=await Cart.findOneAndUpdate({user:req.user.id},{
                $push:{products:req.body}
                },{new:true})
            calc(addToCart)
            return res.status(200).json({message:"done",addToCart,status:200})
        }

    }
})


export const applyCoupon=asyncHandler(async (req,res,next)=>{ 
    const coupon=await Coupon.findOne({code:req.body.code.toLowerCase(),
        usedBy:{$nin:[req.user.id]},
        expire:{$gt:Date.now()}})
    if(!coupon){
        return next(new AppError('coupon not found or expired or already used ',404))
    }
    const cart=await Cart.findOne({user:req.user.id})
    cart.discount=coupon.discount
    await cart.save()
    calc(cart)
    await coupon.updateOne({$push:{usedBy:req.user.id}})
    return res.status(200).json({message:"success",cart,status:200})

})



export const getCart=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOne({user:req.user.id})
    return !cart?next(new AppError('cart doesnt exist',404)):
    res.status(200).json({message:"success",cart,status:200})
})


export const clearCart=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOneAndDelete({user:req.user.id})
    return !cart?next(new AppError('cart doesnt exist',404)):
    res.status(200).json({message:"cart deleted successfully",cart,status:200})
})


export const deleteProduct=asyncHandler(
    async(req,res,next)=>{
        const cart=await Cart.findOneAndUpdate({user:req.user.id},
            {$pull:{products:{_id:req.params.id}}},{new:true})

    if(!cart){
        return next(new AppError('cart is not found!',404))
    }
    calc(cart)        
    return res.json({message:'product deleted from cart',cart,status:200})
    }
) 



export const updateQuantity=asyncHandler(
    async(req,res,next)=>{
    const cart=await Cart.findOne({user:req.user.id})
    if(!cart){
        return next(new AppError('cart is not found!',404))
    }
    const product= await Product.findById(req.params.id)
        if(!product){
            return next(new AppError('not found product ',404))
        } 
    let productExist=false
        cart.products.forEach(async(pro)=>{
            if(pro.product==req.params.id){
                productExist=true
                if(product.stock<req.body.quantity){
                    return next(new AppError('product out of stock',400))
                }
                pro.quantity=req.body.quantity
                await cart.save()
                calc(cart)
                return res.status(200).json({message:"Product quantity updated in cart",cart,status:200})
            }  
        })
        if(!productExist){
        return next(new AppError('product doesnt exist in cart!',404))

        }  
    }
) 

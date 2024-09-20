import Cart from "../../../../database/models/Cart.js";
import Order from "../../../../database/models/Order.js";
import Product from "../../../../database/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utiles/Error.js";
import createInvoice from "../../../utiles/pdf.js";
import User from './../../../../database/models/User.js';

//get card then check if there is products or not
export const addCashOrder=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOne({user:req.user.id})
    if(!cart){
        return next(new AppError('cart is not found!',404))
    }
    if(!cart.products.length){
        return next(new AppError('cart is empty',400))
    }

    for (const element of cart.products) {
        const product = await Product.findById(element.product);
        if (!product) {
            return next(new AppError(`Product not found: ${element.product}`, 404));
        }
        if (product.stock < element.quantity) {
            return next(new AppError(`Product ${element.product} out of stock: ${product.stock}`, 400));
        }
    }
    // cart.products.forEach(async(element)=>{
    //     const product= await Product.findById(element.product)
    //     if(!product){
    //         return next(new AppError(`product not found${element.product}`,404))
    //     }
    //     if(product.stock<element.quantity){
    //         return next(new AppError(`product${element.product} out of stock:${product.stock}`,400))
    //     }
    // })

    for (const element of cart.products) {
        await Product.findByIdAndUpdate(element.product, {
            $inc: { sold: element.quantity, stock: -element.quantity },
        });
    }

    // cart.products.forEach(async(element)=>{
    //     await Product.findByIdAndUpdate(element.product,{
    //         $inc:{sold:element.quantity,stock:-element.quantity}
    //     })
    // })

    req.body.user=req.user.id
    req.body.products=cart.products
    req.body.total=cart.total

    const order= new Order(req.body)
    const newOrder=await order.save()
    const deletedCart=await Cart.findOneAndDelete({user:req.user.id})
    const user = await User.findById(req.user.id)

    //create invoice 
    const invoice = {
        shipping: {
          name:user.name,
          address: newOrder.address,
          city: "cairo",
          state: "shoubra",
          country: "Egypt",
          postal_code: 94111
        },
        items:newOrder.products,
        subtotal:deletedCart.subTotal,
        discount:deletedCart.discount,
        paid: newOrder.total,
        invoice_nr: newOrder._id,
        date:new Date(newOrder.createdAt).toDateString()
      };
      
    await createInvoice(invoice, "invoice.pdf");
    
    return res.status(201).json({message:"order created successfully",newOrder,status:201})
})


export const getorders=asyncHandler(async(req,res,next)=>{
    const orders=await Order.find()
    return !orders.length?next(new AppError('there is no orders yet!',404)):
    res.status(200).json({message:"orders is:",orders,status:200})
})


export const getuserOrders=asyncHandler(async(req,res,next)=>{
    const orders=await Order.find({user:req.res.id})
    return !orders.length?next(new AppError('there is no orders yet!',404)):
    res.status(200).json({message:"orders is:",orders,status:200})
})


export const deleteOrder=asyncHandler(async(req,res,next)=>{
    const orders=await Order.findByIdAndDelete(req.params.id)
    return !orders?next(new AppError('there is no orders to delete',404)):
    res.status(200).json({message:"order deleted successfully",orders,status:200})
})
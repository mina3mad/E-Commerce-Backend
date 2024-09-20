import joi from "joi";

export const addProductSchema=joi.object({
title:joi.string().min(2).max(25).trim().required(),
description:joi.string().min(3).max(1500).trim().required(),
price:joi.number().min(0).required(),
priceAfterDiscount:joi.number().min(0),
stock:joi.number().min(0).required(),
sold:joi.number().min(0).default(0),
rateCount:joi.number().min(0).default(0),
rateAvg:joi.number().min(0).default(0),
category: joi.string().hex().min(24).max(24).required(),
subCategory: joi.string().hex().min(24).max(24).required(),
brand: joi.string().hex().min(24).max(24).required(),

files:joi.object({
    mainImage:joi.array().items(joi.object({size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),})),



    coverImages:joi.array().items(joi.object({size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),}))
})
}).required()
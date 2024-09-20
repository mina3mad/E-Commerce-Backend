import joi from "joi";

export const createCouponSchema=joi.object({
    code:joi.string().trim().min(3).max(30).required(),
    discount:joi.number().min(1).max(100).required(),
    expire:joi.date().greater(Date.now()).required().messages({"date.greater":"expiration date must be greater than now"})
})
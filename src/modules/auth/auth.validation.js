import joi from "joi";

export const signUpSchema=joi.object({
    name:joi.string().lowercase().min(3).max(15).trim().required(),
    email:joi.string().email({minDomainSegments:2}).required(),
    password:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).message({'string.pattern.base':'password must be at least 8 characters and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'}).required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required()
})

export const loginSchema=joi.object({
    email:joi.string().email({minDomainSegments:2}).required(),
    password:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).message({'string.pattern.base':'password must be at least 8 characters and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'}).required(),
})

// export const confirmEmailSchema=joi.object({
//     email:joi.string().email({minDomainSegments:2}).required(),
//     OTP:joi.string().length(4).pattern(/^[0-9]+$/).required(),
// })
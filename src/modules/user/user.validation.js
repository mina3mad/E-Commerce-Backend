import joi from "joi";


export const updatePasswordSchema = joi.object({
    oldPass: joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required().messages({
        'any.required': 'Old password is required',
        'string.empty': 'Old password cannot be empty',
        'string.pattern.base':'password must be at least 8 characters and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    }),
    newPass: joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .invalid(joi.ref('oldPass'))
    .required().messages({
        'any.required': 'New password is required',
        'string.empty': 'New password cannot be empty',
        'string.min': 'New password must be at least 6 characters long',
        'any.invalid': 'New password cannot be the same as the old password',
        'string.pattern.base':'password must be at least 8 characters and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    })
});
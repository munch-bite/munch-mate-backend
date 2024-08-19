import joi from "joi";

export const usersValidator = joi.object({
    firstName: joi.string().required(),
    middleName: joi.string(),
    lastName: joi.string().required(),
    businessName: joi.string().min(3).max(50),
    address: joi.string(),
    location: joi.string(),
    email: joi.string().email().required(),
    phoneNumber: joi.string(),
    role: joi.string().valid("customer", "vendor").required(),
    password: joi.string().min(4).required(),
    confirmPassword: joi.ref("password")
}).with("password", "confirmPassword");
import joi from "joi";

export const vendorsSchema = joi.object({
    firstName: joi.string().min(1).max(25).required(),
    middleName: joi.string().max(25),
    lastName: joi.string().min(1).max(25).required(),
    businessName: joi.string().min(3).max(50).required(),
    address: joi.string(),
    location: joi.string().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string(),
    role: joi.string().valid("vendor").default("vendor"),
    password: joi.string().min(4).required(),
    confirmPassword: joi.ref("password")
}).with("password", "confirmPassword");
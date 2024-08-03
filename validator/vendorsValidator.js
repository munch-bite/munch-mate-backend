import joi from "joi";

export const vendorsSchema = joi.object({
    firstName: joi.string().min(1).max(25).required(),
    middleName: joi.string().max(25),
    lastName: joi.string().min(1).max(25).required(),
    otherNames: joi.string().max(20),
    userName: joi.string().min(3).max(20).lowercase().required(),
    phoneNumber: joi.string(),
    email: joi.string().email().required(),
    role: joi.string().valid("customer", "vendor").default("vendor"),
    password: joi.string().min(4).required(),
    confirmPassword: joi.ref("password")
}).with("password", "confirmPassword");
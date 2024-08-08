import joi from "joi";

export const usersValidator = joi.object({
    firstName: joi.string().required(),
    middleName: joi.string(),
    lastName: joi.string().required(),
    userName: joi.string().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string(),
    role: joi.string().valid("customer").default("customer").required(),
    password: joi.string().min(4),
    confirmPassword: joi.ref("password")
}).with("password", "confirmPassword");
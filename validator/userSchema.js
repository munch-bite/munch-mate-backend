import joi from "joi";

export const usersSchema = joi.object({
    firstName: joi.string().required(),
    middleName: joi.string(),
    lastName: joi.string().required(),
    otherNames: joi.string(),
    userName: joi.string().required(),
    phoneNumber: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().min(4),
    confirmPassword: joi.ref("password")
}).with("password", "confirmPassword");
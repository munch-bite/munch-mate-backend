import joi from "joi";

export const foodValidator = joi.object({
    image: joi.string().required(),
    name: joi.string().required(),
    price: joi.string().required(),
    category: joi.string(),
    description: joi.string()
    // vendor: joi.string()
})
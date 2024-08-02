import joi from "joi";

export const foodItemsValidator = joi.object({
    image: joi.string().required(),
    name: joi.string().required(),
    price: joi.string().required(),
    category: joi.string(),
    description: joi.string(),
    vendor: joi.string()
})
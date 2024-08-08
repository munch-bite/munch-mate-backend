import joi from "joi";

export const ordersValidator = joi.object({
    user: joi.string().required(),
    foodItem: joi.array().items(joi.string().required()).required(),
    // foodItem: joi.string().required(),
    status: joi.string().valid("processing", "out for delivery", "delivered").default("processing"),
    price: joi.number().required(),
    payment: joi.boolean().default(false)
})
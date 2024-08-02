import joi from "joi";

export const ordersValidator = joi.object({
    user: joi.string().required(),
    foodItem: joi.string().required(),
    status: joi.string().valid("processing", "out for delivery", "delivered"),
    totalAmount: joi.string()
})
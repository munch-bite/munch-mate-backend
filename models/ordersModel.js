import { model, Schema, Types } from "mongoose";


const ordersModel = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    foodItem: { type: Types.ObjectId, ref: "FoodItem", required: true },
    status: { type: String, enum: ["processing", "out for delivery", "delivered"], default: "processing" },
    totalAmount: { type: Number, required: true },
}, {
    timestamps: true
})

export const OrdersModel = model("Order", ordersModel);
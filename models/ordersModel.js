import { model, Schema, Types } from "mongoose";


const ordersSchema = new Schema({
    user: { type: Types.ObjectId, ref: "Auth", required: true },
    foodItem: [{ type: Types.ObjectId, ref: "FoodItem", required: true }],
    status: { type: String, enum: ["processing", "out for delivery", "delivered"], default: "processing" },
    price: { type: Number, trim: true, required: true },
    payment: { type: Boolean, default: false }
}, {
    timestamps: true
})

export const OrdersModel = model("Order", ordersSchema);
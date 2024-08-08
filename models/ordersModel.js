import { model, Schema, Types } from "mongoose";


const ordersSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    vendor: { type: Types.ObjectId, ref: "Vendor", required: true },
    foodItem: [{ type: Types.ObjectId, ref: "FoodItem", required: true }],
    status: { type: String, enum: ["processing", "out for delivery", "delivered"], default: "processing" },
    price: { type: Number, required: true },
    payment: { type: Boolean, default: false }
}, {
    timestamps: true
})

export const OrdersModel = model("Order", ordersSchema);
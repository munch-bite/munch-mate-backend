import { Schema, Types } from "mongoose";


const cartSchema = new Schema({
    userID: { type: Types.ObjectId, ref: "Auth", required: true },
    items: [
        {
            itemID: { type: Types.ObjectId, ref: "FoodItem", required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },

})
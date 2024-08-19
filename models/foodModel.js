import { model, Schema, Types } from "mongoose";


const foodSchema = new Schema({
    image: { type: String },
    name: { type: String, trim: true, required: true },
    price: { type: String, trim: true, required: true },
    category: { type: String },
    description: { type: String, trim: true },
    vendor: { type: Types.ObjectId, ref: "Auth", required: true }
}, {
    timestamps: true
})

export const FoodModel = model("Food", foodSchema);
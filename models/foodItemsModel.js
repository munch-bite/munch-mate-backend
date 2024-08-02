import { model, Schema, Types } from "mongoose";


const foodItemsModel = new Schema({
    image: { type: String },
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    vendor: { type: Types.ObjectId, ref: "Vendor", required: true }
}, {
    timestamps: true
})

export const FoodItemsModel = model("FoodItem", foodItemsModel);
import { model, Schema } from "mongoose";


const vendorsSchema = new Schema({
    firstName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true, required: true },
    otherNames: { type: String, trim: true },
    userName: { type: String, unique: true, trim: true, required: true },
    email: { type: String, required: true, trim: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: "vendor" },
    resetToken: { type: String, trim: true, }
}, {
    timestamps: true
});

export const VendorsModel = model("Vendor", vendorsSchema);
import { model, Schema } from "mongoose";


const vendorsSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    otherNames: { type: String },
    userName: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: "vendor" },
    resetToken: { type: String }
}, {
    timestamps: true
});

export const VendorsModel = model("Vendor", vendorsSchema);
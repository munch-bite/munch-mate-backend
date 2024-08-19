import { model, Schema } from "mongoose";


const usersSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    businessName: { type: String, unique: true, trim: true, default: " " },
    address: { type: String, trim: true },
    location: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: { type: String, enum: ["customer", "vendor"], required: true },
    resetToken: { type: String }
}, {
    minimize: false
}, {
    timestamps: true
});

export const UserModel = model("Auth", usersSchema);
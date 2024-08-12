import { model, Schema } from "mongoose";


const usersSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: { type: String, enum: ["customer"], default: "customer", required: true },
    resetToken: { type: String }
}, {
    minimize: false
}, {
    timestamps: true
});

export const UserModel = model("User", usersSchema);
import { model, Schema } from "mongoose";


const usersModel = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor"], default: "customer", required: true },
    resetToken: { type: String }
}, {
    timestamps: true
});

export const UserModel = model("User", usersModel);
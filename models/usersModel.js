import { model, Schema } from "mongoose";


const usersModel = new Schema({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    otherNames: { type: String },
    userName: { type: String},
    email: { type: String },
    password: { type: String, required: true }
});

export const UserModel = model("User", usersModel);
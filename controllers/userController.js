import { UserModel } from "../models/usersModel.js";
import { usersSchema } from "../schema/userSchema.js";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
    try {
        const { error, value } = usersSchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { email } = value;

        const ifUserExists = await UserModel.findOne({ email });

        if (ifUserExists) {
            return res.status(400).send("User has already signed up")
        }

        const hashedPassword = bcrypt.hashSync(value.password, 10);

        value.password = hashedPassword;

        const newUser = await UserModel.create(value);

        res.status(201).send(newUser);

    } catch (error) {
        next(error);
    }
}
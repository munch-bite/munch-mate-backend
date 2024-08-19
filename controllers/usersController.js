import { UserModel } from "../models/usersModel.js";
import { usersValidator } from "../validators/usersValidator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
    try {
        const { error, value } = usersValidator.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { email, businessName, password, phoneNumber, location, role } = value;

        if (!["customer", "vendor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        if (role === "vendor" && !businessName && !location) {
            return res.status(400).json({ message: "Business name and location are required for vendors" });
        }

        if (role === "customer" && businessName) {
            return res.status(400).json({ message: "Business name should not be provided for customers" });
        }

        // query condition
        const queryCondition = {};
        if (businessName) queryCondition.businessName = businessName;
        if (email) queryCondition.email = email;
        if (role) queryCondition.role = role;
        if (phoneNumber) queryCondition.phoneNumber = phoneNumber;

        const existingUser = await UserModel.findOne({
            ...queryCondition
        });

        if (existingUser) {
            return res.status(400).send("User has already signed up")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            ...value,
            password: hashedPassword
        });

        res.status(201).json({ message: `${value.userName || value.businessName || value.email || value.phoneNumber} registered successfully!` });

    } catch (error) {
        next(error);
    }
}

export const tokenLogin = async (req, res, next) => {
    try {

        const { businessName, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // query condition
        let queryCondition = {};

        if (businessName) queryCondition.businessName = businessName;
        if (email) queryCondition.email = email;


        const user = await UserModel.findOne({
            ...queryCondition
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY }
        );

        const excludePassword = user.toObject();
        delete excludePassword.password;

        res.status(200).json({
            message: `Welcome back, ${user.userName || user.email || user.phoneNumber}!`,
            accessToken: token,
            userDetails: excludePassword
        });

    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res) => {
    try {
        await req.session.destroy();

        res.status(200).json({ message: "User successfully logged out" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
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

        const { userName, email, businessName, password, location, role } = value;

        if (!["customer", "vendor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        if (role === "vendor" && !businessName && !location) {
            return res.status(400).json({ message: "Business name and location are required for vendors" });
        }

        if (role === "customer" && businessName) {
            return res.status(400).json({ message: "Business name should not be provided for customers" });
        }

        // const existingUser = await UserModel.findOne({
        //     $or: [
        //         { userName },
        //         { email },
        //         { businessName }
        //     ]
        // });

        // query condition
        const queryCondition = {};
        if (userName) queryCondition.userName = userName;
        if (businessName) queryCondition.businessName = businessName;
        if (email) queryCondition.email = email;

        const existingUser = await UserModel.findOne(queryCondition);

        if (existingUser) {
            return res.status(400).send("User has already signed up")
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);

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

        const { userName, businessName, email, phoneNumber, role, password } = req.body;

        if (!password || !role) {
            return res.status(400).json({ message: "Password and Role are required" });
        }

        if (!["customer", "vendor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // query condition
        let queryCondition = {};

        if (role === "customer") {
            if (!userName || !email) {
                return res.status(400).json({ message: "For customers, a username or email is required to login" })
            }

            if (userName) queryCondition.userName = userName;
            if (email) queryCondition.email = email;
        } else if (role === "vendor") {
            if (!businessName) {
                return res.status(400).json({ message: "For vendors, your Business Name is required to login" });
            }

            queryCondition.businessName = businessName;
        }

        const user = await UserModel.findOne({
            ...queryCondition,
            role
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
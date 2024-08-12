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

        const existingUser = await UserModel.findOne({
            $or: [
                { userName: value.userName },
                { email: value.email }
            ]
        });

        if (existingUser) {
            return res.status(400).send("User has already signed up")
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);

        await UserModel.create({
            ...value,
            password: hashedPassword
        });

        res.status(201).json({ message: `${value.userName || value.email || value.phoneNumber} registered successfully!` });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { userName, email, phoneNumber, password } = req.body;

        const user = await UserModel.findOne({
            $or: [
                { userName },
                { email },
                { phoneNumber }
            ]
        })

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        // create a session for user
        req.session.user = { id: user.id }

        // log user in
        res.status(200).json({ message: `${user.userName || user.email || user.phoneNumber} logged in` });

    } catch (error) {
        next(error);
    }
}

export const token = async (req, res, next) => {
    try {
        const { userName, email, phoneNumber, password } = req.body;

        const user = await UserModel.findOne({
            $or: [
                { userName },
                { email },
                { phoneNumber }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid login credentials" })
        }

        // create a token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY }
        )

        // log user in
        res.status(200).json({
            message: `${user.userName || user.email || user.phoneNumber} logged in`,
            accessToken: token
        })
        console.log(user.email);

    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res) => {
    try {
        await req.session.destroy();

        res.status(200).json({ message: "User successfully logged out" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
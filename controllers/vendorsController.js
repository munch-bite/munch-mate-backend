import { VendorsModel } from "../models/vendorsModel.js";
import { vendorsSchema } from "../validator/vendorsValidator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
    try {
        const { error, value } = vendorsSchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { email } = value;

        const ifVendorExists = await VendorsModel.findOne({ email });

        if (ifVendorExists) {
            return res.status(400).send("Vendor has already signed up, try logging in")
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);

        await VendorsModel.create({
            ...value,
            password: hashedPassword
        });

        res.status(201).json({ message: "Registration successful!" });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { error, value } = vendorsSchema.validate(req.body)

        if (error) {
            return res.status(400).send(error.details[0].message)
        }

        const vendor = await VendorsModel.findOne({
            $or: [
                { userName: value.userName },
                { email: value.email },
                { phoneNumber: value.phoneNumber }
            ]
        })

        if (!vendor) {
            return res.status(404).json({ message: "Vendor does not exist, try signing up" });
        }

        const correctPassword = await bcrypt.compare(value.password, vendor.password)

        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        // create a session for vendor
        req.session.vendor = { id: vendor._id };

        // log user in
        res.status(200).json({ message: "Vendor logged in" });

    } catch (error) {
        next(error);
    }
}

export const token = async (req, res, next) => {
    try {
        const { error, value } = vendorsSchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const vendor = await VendorsModel.findOne({
            $or: [
                { userName: value.userName },
                { email: value.email },
                { phoneNumber: value.phoneNumber }
            ]
        });

        if (!vendor) {
            return res.status(400).json({ message: "Vendor does not exist, try signing up" })
        }

        const correctPassword = await bcrypt.compare(value.password, vendor.password);

        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid login credentials" })
        }

        // create a token
        const token = jwt.sign(
            { id: vendor._id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: process.env.TOKEN_EXPIRY }
        )

        // log user in
        res.status(200).json({
            message: "Vendor logged in",
            accessToken: token
        })

    } catch (error) {
        next(error)
    }
}
import { UserModel } from "../models/usersModel.js"
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        if (req.session?.user) {

            const user = await UserModel.findById(req.session.user.id);

            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            req.user = user;

            next();
        } else if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(" ")[1];

                const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

                const user = await UserModel.findById(decoded.id)

                if (!user) {
                    return res.status(400).json({ message: "User does not exist" });
                }

                req.user = user;

                next();
            } catch (error) {
                res.status(401).json({ message: "Invalid token", error });
            }
        } else {
            res.status(401).json({ message: "Not Authenticated" });
        }

    } catch (error) {
        next(error);
    }
}

export const vendorPermission = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "vendor") {
            next()
        } else {
            res.status(401)
            throw new Error("Not authorized as a vendor");
        }
    } catch (error) {
        next(error)
    }
}

export const customerPermission = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "customer") {
            next()
        } else {
            res.status(401)
            throw new Error("Not authorized as a customer");
        }
    } catch (error) {
        next(error)
    }
}
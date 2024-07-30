import { UserModel } from "../models/usersModel.js"
import jwt from "jsonwebtoken;"

export const isAuthenticated = async (req, res, next) => {
    try {
        // check if session has a user
        if(req.session.user) {
            // check if user exists in the database
            const user = await UserModel.findById(req.session.user.id);

            if(!user) {
                return res.status(400).json({ message: "User does not exist"});
            }

            next();
        } else if (req.headers.authorization) {
           try {
             //extract token from headers
             const token = req.headers.authorization.split("")[1];

             // verify token to get user and append request
             req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
 
             // check if user exists in the database
             const user = await UserModel.findById(req.user.id)
 
             if(!user) {
                 return res.status(400).json({ message: "User does not exist" });
             }
             
             next();
           } catch (error) {
             res.status(401).json(error);
           }
        } else {
            res.status(401).json({ message: "Not Authenticated" });
        }

    } catch (error) {
        next(error);
    }
}
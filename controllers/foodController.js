import { FoodModel } from "../models/foodModel.js";
import { UserModel } from "../models/usersModel.js";
import { VendorsModel } from "../models/vendorsModel.js";
import { foodValidator } from "../validators/foodValidator.js";


export const addFood = async (req, res, next) => {
    try {
        const { error, value } = foodValidator.validate({
            ...req.body,
            image: req.file.filename
        });

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const vendorSessionID = req.session?.user?.id || req.user?.id;

        const findVendor = await VendorsModel.findById(vendorSessionID);

        if (!findVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // create new food item
        await FoodModel.create({
            ...value,
            vendor: vendorSessionID
        });

        // respond with the created food item
        res.status(201).json({ message: "Your Food has been added successfully" });
    } catch (error) {
        next(error);
    }
}

export const listFood = async (req, res, next) => {
    try {
        const foods = await FoodModel.find({});

        res.status(200).json({ Food: foods });
    } catch (error) {
        next(error);
    }
}

export const deleteFood = async (req, res, next) => {
    try {
        const userSessionID = req.session?.user?.id || req.user?.id;

        const user = await UserModel.findById(userSessionID);

        if (!user) {
            return res.status(404).send("User not found");
        }

        const food = await FoodModel.findByIdAndDelete(req.params.id, req.body, { new: true });

        res.status(200).json(food);

    } catch (error) {
        next(error);
    }
}
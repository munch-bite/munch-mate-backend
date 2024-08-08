import { FoodItemsModel } from "../models/foodItemsModel.js";
import { VendorsModel } from "../models/vendorsModel.js";
import { foodItemsValidator } from "../validators/foodItemsValidator.js";


export const addFoodItem = async (req, res, next) => {
    try {
        const { error, value } = foodItemsValidator.validate({
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
        const newFood = await FoodItemsModel.create({
            ...value,
            vendor: vendorSessionID
        });

        await newFood.save();

        // respond with the created food item
        res.status(201).send("Food Item Created!");
    } catch (error) {
        next(error);
    }
}
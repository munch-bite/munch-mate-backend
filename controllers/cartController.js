import { UserModel } from "../models/usersModel.js";
import { usersValidator } from "../validators/usersValidator.js";


// add to cart
const addToCart = async (req, res, next) => {
    try {
        const { error, value } = usersValidator.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const userID = req.session?.user?.id || req.user?.id;

        const user = await UserModel.findById(userID);

        if (!user) {
            return res.status(400).json({ message: "No user found" });
        }

        let cartData = user.cartData;

        if (!cartData) {
            cartData = [];
        }

        const itemToAdd = {
            itemID: value.itemID,
            quantity: value.quantity || 1
        }

        const itemAlreadyInCArt = cartData.findIndex(item => item.itemID === itemToAdd.itemID);

        if (itemAlreadyInCArt >= 0) {
            cartData[itemAlreadyInCArt].quantity += itemToAdd.quantity;
        } else {
            cartData.push(itemToAdd);
        }
    } catch (error) {
        next(error);
    }
}


// remove items from cart
const removeFromCart = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

// get cart data
const getCartData = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

export { addToCart, removeFromCart, getCartData }
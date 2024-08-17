import { Router } from "express";
import { addToCart, getCartData, removeFromCart } from "../controllers/cartController.js";

const cartRoute = Router();

cartRoute.post("/add-to-cart", addToCart);
cartRoute.get("/get-cart-items", getCartData);
cartRoute.patch("remove-from-cart", removeFromCart);

export default cartRoute;
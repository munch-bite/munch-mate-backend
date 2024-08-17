import { Router } from "express";
import { addToCart, getCartData, removeFromCart } from "../controllers/cartController.js";
import { customerPermission, isAuthenticated } from "../middlewares/auth.js";

const cartRoute = Router();

cartRoute.post("/add-to-cart", isAuthenticated, customerPermission, addToCart);
cartRoute.get("/get-cart-items", isAuthenticated, customerPermission, getCartData);
cartRoute.patch("/remove-from-cart", isAuthenticated, customerPermission, removeFromCart);

export default cartRoute;
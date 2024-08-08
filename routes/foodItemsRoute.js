import { Router } from "express";
import { isAuthenticated, vendorPermission } from "../middlewares/auth.js";
import { addFoodItem } from "../controllers/foodItemsController.js";
import { upload } from "../middlewares/upload.js";

const foodItemsRoute = Router();

foodItemsRoute.post("/foodItems", isAuthenticated, vendorPermission, upload.single("image"), addFoodItem);

export default foodItemsRoute;
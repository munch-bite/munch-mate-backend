import { Router } from "express";
import { isAuthenticated, vendorPermission } from "../middlewares/auth.js";
import { addFoodItem } from "../controllers/foodItemsController.js";
import { upload } from "../middlewares/upload.js";

const foodItemsRouter = Router();

foodItemsRouter.post("/foodItems", isAuthenticated, vendorPermission, upload.single("image"), addFoodItem);

export default foodItemsRouter;
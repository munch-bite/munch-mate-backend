import { Router } from "express";
import { isAuthenticated, vendorPermission } from "../middlewares/auth.js";
import { addFood, deleteFood, listFood } from "../controllers/foodController.js";
import { upload } from "../middlewares/upload.js";

const foodRoute = Router();

foodRoute.post("/add-food", isAuthenticated, vendorPermission, upload.single("image"), addFood);
foodRoute.get("/food-list", listFood);
foodRoute.post("/delete-food/:id", deleteFood);

export default foodRoute;
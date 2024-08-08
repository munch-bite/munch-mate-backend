import { Router } from "express";
import { confirmPayment, placedOrder } from "../controllers/ordersController.js";
import { customerPermission, isAuthenticated } from "../middlewares/auth.js";


const ordersRoute = Router();

ordersRoute.post("/orders/place-order", isAuthenticated, customerPermission, placedOrder);

ordersRoute.post("/orders/confirm-payment", isAuthenticated, customerPermission, confirmPayment);

export default ordersRoute;
import { Router } from "express";
import { confirmPayment, placedOrder } from "../controllers/ordersController.js";
import { customerPermission, isAuthenticated } from "../middlewares/auth.js";


const ordersRouter = Router();

ordersRouter.post("/orders/place-order", isAuthenticated, customerPermission, placedOrder);

ordersRouter.post("/orders/confirm-payment", isAuthenticated, customerPermission, confirmPayment);

export default ordersRouter;
import { Router } from "express";
import { signup, token } from "../controllers/vendorsController.js";

const vendorsRoute = Router();

vendorsRoute.post("/vendors/auth/signup", signup);
vendorsRoute.post("/vendors/auth/token", token);

export default vendorsRoute;
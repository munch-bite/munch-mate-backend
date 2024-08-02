import { Router } from "express";
import { login, signup, token } from "../controllers/userController.js";

const vendorsRouter = Router();

vendorsRouter.post("/vendors/auth/signup", signup);
vendorsRouter.post("/vendors/auth/login", login);
vendorsRouter.post("/vendors/auth/token", token);

export default vendorsRouter;

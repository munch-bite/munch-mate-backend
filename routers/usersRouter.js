import { Router } from "express";
import { signup } from "../controllers/userController.js";

const usersRouter = Router();

usersRouter.post("/users/auth/signup", signup);

export default usersRouter;
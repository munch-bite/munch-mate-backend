import { Router } from "express";
import { login, signup, token } from "../controllers/userController.js";

const usersRouter = Router();

usersRouter.post("/users/auth/signup", signup);
usersRouter.post("/users/auth/login", login);
usersRouter.post("/users/auth/token", token);

export default usersRouter;
import { Router } from "express";
import { logout, signup, tokenLogin } from "../controllers/usersController.js";

const usersRoute = Router();

usersRoute.post("/users/auth/signup", signup);
usersRoute.post("/users/auth/token/login", tokenLogin);
usersRoute.post("/users/auth/logout", logout);

export default usersRoute;
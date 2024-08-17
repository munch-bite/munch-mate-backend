import { Router } from "express";
import { logout, signup, tokenLogin } from "../controllers/usersController.js";

const usersRoute = Router();

usersRoute.post("/auth/signup", signup);
usersRoute.post("/auth/token/login", tokenLogin);
usersRoute.post("/auth/logout", logout);

export default usersRoute;
import { Router } from "express";
import { login, logout, signup, token } from "../controllers/usersController.js";

const usersRoute = Router();

usersRoute.post("/users/auth/signup", signup);
usersRoute.post("/users/auth/session/login", login);
usersRoute.post("/users/auth/token/login", token);
usersRoute.post("/users/auth/token/logout", logout);

export default usersRoute;
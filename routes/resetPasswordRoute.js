import { Router } from "express";
import { resetPassword } from "../controllers/resetPasswordController.js";


const passwordResetRouter = Router();

passwordResetRouter.post("/api/auth/password/reset-password", resetPassword);

export default passwordResetRouter;
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.logInUser);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/me", auth(), AuthController.getCurrentUser);

export const authRoute = router;

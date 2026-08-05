import { Router } from "express";
import { AuthController } from "./auth.controller";
import { handleAuthError } from "../../middleware/auth";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.logInUser);
router.post("/refresh-token", AuthController.refreshToken);
router.use(handleAuthError);

export const authRoute = router;

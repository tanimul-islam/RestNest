import { Router } from "express";
import { AuthController } from "./auth.controller";
import { handleAuthError, requireAuth } from "./auth.middleware";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.logInUser);

router.use(handleAuthError);

export const authRoute = router;

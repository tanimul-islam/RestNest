import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerUserValidationSchema),
  AuthController.registerUser,
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginUserValidationSchema),
  AuthController.logInUser,
);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/me", auth(), AuthController.getCurrentUser);

export const authRoute = router;

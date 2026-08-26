import { Router } from "express";
import { auth } from "../../middleware/auth";
import { CategoryController } from "./category.controller";
import validateRequest from "../../middleware/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory,
);

export const categoryRoute = router;

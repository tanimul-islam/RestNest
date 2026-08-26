import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { PropertyValidation } from "./property.validation";
import { PropertyController } from "./property.controller";

const router = Router();

router.post(
  "/",
  auth("LANDLORD"),
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty,
);

router.get(
  "/",
  validateRequest(PropertyValidation.getPropertyValidationSchema),
  PropertyController.getProperties,
);

export const PropertyRoute = router;

import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { PropertyValidation } from "./property.validation";
import { PropertyController } from "./property.controller";

const publicRouter = Router();
const landlordRouter = Router();

landlordRouter.post(
  "/",
  auth("LANDLORD"),
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty,
);

landlordRouter.put(
  "/:id",
  auth("LANDLORD"),
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty,
);

landlordRouter.delete(
  "/:id",
  auth("LANDLORD"),
  validateRequest(PropertyValidation.deletePropertyValidationSchema),
  PropertyController.deleteProperty,
);

publicRouter.get(
  "/",
  validateRequest(PropertyValidation.getPropertyValidationSchema),
  PropertyController.getProperties,
);
publicRouter.get(
  "/:id",
  validateRequest(PropertyValidation.getPropertyByIdValidationSchema),
  PropertyController.getPropertyById,
);

export const PropertyRoute = publicRouter;
export const LandlordPropertyRoute = landlordRouter;

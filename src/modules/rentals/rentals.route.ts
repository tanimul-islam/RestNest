import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { RentalValidation } from "./rentals.validations";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  validateRequest(RentalValidation.createRentalRequestSchema),
  auth("TENANT"),
);

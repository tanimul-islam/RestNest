import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { RentalValidation } from "./rentals.validations";
import { auth } from "../../middleware/auth";
import { rentalController } from "./rentals.controller";

const router = Router();

router.post(
  "/",
  validateRequest(RentalValidation.createRentalRequestSchema),
  auth("TENANT"),
  rentalController.createRentalRequest,
);

router.get("/", auth("TENANT"), rentalController.getRentalRequest);
router.get(
  "/:id",
  auth("TENANT"),
  validateRequest(RentalValidation.getRequestDetailsSchema),
  rentalController.rentalRequestDetails,
);

export const RentalRouter = router;

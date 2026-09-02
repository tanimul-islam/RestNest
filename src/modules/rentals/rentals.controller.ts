import { Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { RentalService } from "./rentals.service";
import sendResponse from "../../utils/sendResponse";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const tenatId = req.user.id;

  const result = await RentalService.createRequest(tenatId, req.body);

  sendResponse(res, {
    statusCode: 210,
    success: true,
    message: "Rental Request Created",
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
};

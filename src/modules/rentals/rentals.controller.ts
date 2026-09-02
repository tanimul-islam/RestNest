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

const getRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user.id;

  const result = await RentalService.getMyRentalRequests(tenantId);
  sendResponse(res, {
    statusCode: 210,
    success: true,
    message: "Rental Request Retrived",
    data: result,
  });
});

const rentalRequestDetails = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const tenantId = req.user.id;

  const result = await RentalService.rentalRequestDetailsById(
    requestId as string,
    tenantId,
  );

  sendResponse(res, {
    statusCode: 210,
    success: true,
    message: "Rental Request Details Retrived",
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getRentalRequest,
  rentalRequestDetails,
};

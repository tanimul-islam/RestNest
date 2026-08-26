import { Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { PropertyService } from "./property.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
const createProperty = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user.id;

  const result = await PropertyService.createProperty(landlordId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Propert Created Successfully",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
};

import { Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { PropertyService } from "./property.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PropertyFilters } from "./property.interface";
import ApiError from "../../utils/apiError";
const createProperty = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user.id;

  const result = await PropertyService.createProperty(landlordId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property Created Successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query as unknown as PropertyFilters;

  const result = await PropertyService.getProperties(filters);
  if (!result || (Array.isArray(result) && result.length === 0)) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No Property Available, change your filter",
      { field: "filter" },
    );
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties Retrived Successfully",
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PropertyService.getPropertyById(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Retrived Successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = req.user.id;

  const result = await PropertyService.updateProperty(
    id as string,
    landlordId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Updated!",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = req.user.id;

  const result = await PropertyService.deleteProperty(id as string, landlordId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property Updated!",
    data: result,
  });
});

export const PropertyController = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

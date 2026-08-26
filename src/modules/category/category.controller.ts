import { Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { CategoryService } from "./category.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  console.log("Request came here");
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category Created Successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
};

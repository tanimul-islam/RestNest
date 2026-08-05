import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await AuthService.getCurrentUser(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Current user retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  logInUser,
  getCurrentUser,
};

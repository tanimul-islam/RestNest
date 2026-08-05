import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { UserRole } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../config/prisma";
import catchAsync from "../utils/asyncHandler";
import { jwtUtils } from "../utils/jwt";
import ApiError from "../utils/apiError";

type AuthRequest = Request & {
  user?: {
    email: string;
    name: string;
    id: string;
    role: UserRole;
  };
};

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not logged in. Please log in to access this resource.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret as string,
      );

      if (!verifiedToken.success) {
        throw new Error(verifiedToken.error);
      }

      const { id, role } = verifiedToken.data as JwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden. You don't have permission to access this resource.",
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User not found. Please log in again.",
        );
      }

      if (user.status === "BANNED") {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Your account has been blocked. Please contact support.",
        );
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    },
  );
};

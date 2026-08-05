import type { ErrorRequestHandler, RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../utils/apiError";
import { jwtUtils } from "../../utils/jwt";

type AuthTokenPayload = JwtPayload & {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
};

const isAuthTokenPayload = (value: unknown): value is AuthTokenPayload => {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<AuthTokenPayload>;
  return (
    typeof payload.id === "string" &&
    typeof payload.name === "string" &&
    typeof payload.email === "string" &&
    (payload.role === "TENANT" ||
      payload.role === "LANDLORD" ||
      payload.role === "ADMIN")
  );
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return next(new ApiError(401, "Authentication is required"));
  }
  if (!config.jwt_access_secret) {
    return next(new ApiError(500, "JWT_ACCESS_SECRET is not configured"));
  }

  const verification = jwtUtils.verifyToken(token, config.jwt_access_secret);
  if (!verification.success || !isAuthTokenPayload(verification.data)) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }

  req.user = {
    id: verification.data.id,
    name: verification.data.name,
    email: verification.data.email,
    role: verification.data.role,
  };
  next();
};

export const handleAuthError: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  const isApiError = error instanceof ApiError;
  const statusCode = isApiError ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: isApiError ? error.message : "Internal server error",
  });
};

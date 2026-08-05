import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import { prisma } from "../../config/prisma";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import ApiError from "../../utils/apiError";
import { LoginUserInput, RegisterUserInput } from "./auth.interface";

const registerUser = async (payload: RegisterUserInput) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User exist with this email");
  }

  if (!["TENANT", "LANDLORD"].includes(role)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Role must be TENANT or LANDLORD",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return createdUser;
};

const loginUser = async (payload: LoginUserInput) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Password or Email!");
  }

  if (user.status === "BANNED") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User is Banned, contact support!",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

const generatehToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  if (!verifiedRefreshToken.success) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      String(verifiedRefreshToken.error),
    );
  }
  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User is Banned, contact support!",
    );
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  return accessToken;
};
const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === "BANNED") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User is banned. Please contact support.",
    );
  }

  return user;
};
export const AuthService = {
  registerUser,
  loginUser,
  generatehToken,
  getCurrentUser,
};

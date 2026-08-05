import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: Secret): string | JwtPayload => {
  return jwt.verify(token, secret);
};

export const jwtUtils = {
  createToken,
  verifyToken,
};

import { ZodObject } from "zod";
import catchAsync from "../utils/asyncHandler";

const validateRequest = (schema: ZodObject<any>) => {
  return catchAsync(async (req, res, next) => {
    const parsedData = schema.parse({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    });

    req.body = parsedData.body;

    next();
  });
};

export default validateRequest;

import type { RequestHandler } from "express";

const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;

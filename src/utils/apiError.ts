class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorDetails?: unknown;

  constructor(statusCode: number, message: string, errorDetails?: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

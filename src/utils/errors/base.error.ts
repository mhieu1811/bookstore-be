class BaseError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string, isOperational: boolean) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
export default BaseError;

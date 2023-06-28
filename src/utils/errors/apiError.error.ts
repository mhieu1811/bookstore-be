import BaseError from './base.error';
export default class ApiError extends BaseError {
  message: string;
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(statusCode, message, true);

    this.message = message;
    this.statusCode = statusCode;
  }
}

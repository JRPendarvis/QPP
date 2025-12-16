import { Response } from 'express';

export class ResponseHelper {
  static success(res: Response, statusCode: number, message: string, data?: any) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data })
    });
  }

  static error(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static validationError(res: Response, message: string) {
    return this.error(res, 400, message);
  }

  static unauthorizedError(res: Response, message: string) {
    return this.error(res, 401, message);
  }

  static serverError(res: Response, message: string = 'Internal server error') {
    return this.error(res, 500, message);
  }
}

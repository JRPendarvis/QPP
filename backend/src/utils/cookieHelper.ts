import { Response } from 'express';
import { AUTH_CONSTANTS } from '../config/constants';

export class CookieHelper {
  static setAuthCookie(res: Response, token: string): void {
    res.cookie(AUTH_CONSTANTS.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE
    });
  }

  static clearAuthCookie(res: Response): void {
    res.clearCookie(AUTH_CONSTANTS.COOKIE_NAME);
  }
}

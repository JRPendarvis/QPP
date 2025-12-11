// Backend constants and configuration
export const AUTH_CONSTANTS = {
  COOKIE_NAME: 'token',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  JWT_EXPIRY: '7d',
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const SERVER_CONSTANTS = {
  DEFAULT_PORT: 3001,
  TRUST_PROXY: true,
} as const;

export const CORS_ORIGINS = [
  "https://www.quiltplannerpro.com",
  "https://qpp-frontend-production.up.railway.app",
  "https://qpp-production.up.railway.app",
  "http://localhost:3000",
];
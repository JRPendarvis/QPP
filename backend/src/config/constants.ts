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

export const CUSTOM_BLOCK_CONSTANTS = {
  SUPPORTED_GRID_SIZES: [
    { value: 2, label: '2×2 Grid (Four Patch)', squares: 4 },
    { value: 3, label: '3×3 Grid (Nine Patch)', squares: 9 },
    { value: 4, label: '4×4 Grid (Sixteen Patch)', squares: 16 },
    { value: 5, label: '5×5 Grid (Twenty-Five Patch)', squares: 25 },
    { value: 6, label: '6×6 Grid (Thirty-Six Patch)', squares: 36 },
    { value: 7, label: '7×7 Grid (Forty-Nine Patch)', squares: 49 },
  ],
  MIN_GRID_SIZE: 2,
  MAX_GRID_SIZE: 7,
  MAX_BLOCKS_PER_USER: 10,
} as const;

export const CORS_ORIGINS = [
  "https://www.quiltplannerpro.com",
  "https://quiltplannerpro.com",
  "https://app-frontend-production.up.railway.app",
  "http://localhost:3000",
];
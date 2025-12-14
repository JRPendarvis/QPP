// Frontend constants and configuration
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'token',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PRICING: '/pricing',
  UPLOAD: '/upload',
} as const;

export const UI_CONSTANTS = {
  BRAND_NAME: 'Quilt Planner Pro',
  PRIMARY_COLOR: 'red',
  SECONDARY_COLOR: 'indigo',
} as const;
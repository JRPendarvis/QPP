/**
 * Shared Constants Between Frontend and Backend
 * 
 * Keep synchronized to prevent divergence between client and server.
 * Use this as the single source of truth for configuration values.
 */

/**
 * Application Metadata
 */
export const APP_CONFIG = {
  BRAND_NAME: 'Quilt Planner Pro',
  VERSION: '0.2.00002',
  SUPPORT_EMAIL: 'support@quiltplannerpro.com',
  ADMIN_EMAIL: 'admin@quiltplannerpro.com',
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  JWT_EXPIRY: '7d',
  PASSWORD_MIN_LENGTH: 8,
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
} as const;

/**
 * Subscription Tiers
 * Single source of truth for tier names, credit amounts, and limits.
 */
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    credits_per_month: 3,
    max_fabrics: 3,
    label: 'Free',
  },
  HOBBYIST: {
    id: 'hobbyist',
    name: 'Hobbyist',
    credits_per_month: 15,
    max_fabrics: 10,
    label: 'Hobbyist',
  },
  ENTHUSIAST: {
    id: 'enthusiast',
    name: 'Enthusiast',
    credits_per_month: 40,
    max_fabrics: 10,
    label: 'Enthusiast',
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    credits_per_month: 75,
    max_fabrics: 10,
    label: 'Pro',
  },
} as const;

/**
 * Billing Intervals
 */
export const BILLING_INTERVALS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

/**
 * Credit Costs
 * Billable AI actions and their credit costs.
 * Non-billable actions (pattern selection, generation, analysis) cost 0.
 */
export const CREDIT_COSTS = {
  FABRIC_COORDINATION: 1, // auto-assign-roles action
} as const;

/**
 * Pattern Configuration
 */
export const PATTERN_CONFIG = {
  MIN_FABRICS: 2,
  MAX_FABRICS: 8,
  DEFAULT_GRID_SIZE: 6,
  SKILL_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert'],
} as const;

/**
 * Quilt Size Catalog
 * Standard quilt dimensions available for generation.
 */
export const QUILT_SIZES = {
  BABY: { width: 36, height: 36, label: 'Baby (36×36)' },
  CRIB: { width: 36, height: 48, label: 'Crib (36×48)' },
  LAP: { width: 48, height: 60, label: 'Lap (48×60)' },
  TWIN: { width: 60, height: 80, label: 'Twin (60×80)' },
  QUEEN: { width: 90, height: 100, label: 'Queen (90×100)' },
  KING: { width: 108, height: 108, label: 'King (108×108)' },
} as const;

/**
 * Fabric Roles
 * Standard roles for fabric assignment in patterns.
 */
export const FABRIC_ROLES = {
  BACKGROUND: 'background',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  ACCENT: 'accent',
} as const;

/**
 * UI Colors
 */
export const UI_COLORS = {
  PRIMARY: 'red',
  SECONDARY: 'indigo',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
} as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  
  // Patterns
  PATTERNS: '/api/patterns',
  PATTERN_GENERATE: '/api/patterns/generate',
  PATTERN_AUTO_ASSIGN: '/api/patterns/auto-assign-roles',
  
  // Fabrics
  FABRICS: '/api/fabrics',
  FABRIC_CHECK_AVAILABILITY: '/api/fabrics/check-availability',
  FABRIC_COMMIT: '/api/fabrics/commit',
  
  // User
  PROFILE: '/api/user/profile',
  USAGE_STATS: '/api/user/usage-stats',
  
  // Admin
  ADMIN_OVERVIEW: '/api/admin/overview',
  ADMIN_USAGE_STATS: '/api/admin/usage-stats',
} as const;

/**
 * Frontend Routes
 */
export const FRONTEND_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PRICING: '/pricing',
  UPLOAD: '/upload',
  BLOCK_DESIGNER: '/block-designer',
  FABRICS: '/fabrics',
  ADMIN: '/admin',
} as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_FABRIC_NAME_LENGTH: 100,
  MAX_TAGS_PER_FABRIC: 10,
} as const;

/**
 * Cache Durations (in milliseconds)
 */
export const CACHE_DURATIONS = {
  USER_SESSION: 7 * 24 * 60 * 60 * 1000, // 7 days
  PATTERN_METADATA: 24 * 60 * 60 * 1000,  // 24 hours
  API_RESPONSE: 5 * 60 * 1000,            // 5 minutes
} as const;

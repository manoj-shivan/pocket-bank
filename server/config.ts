/**
 * Server-side configuration.
 * In a real application the JWT secret would come from environment variables.
 * For this portfolio demo a hardcoded secret is used to keep setup simple.
 */
export const JWT_SECRET = 'retro-finance-demo-secret-do-not-use-in-production'

/**
 * Token expires after 30 minutes of inactivity to match the project spec.
 */
export const JWT_EXPIRES_IN = '30m'

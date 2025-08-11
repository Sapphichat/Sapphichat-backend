// Export all middlewares from a single file to facilitate imports
export { 
    validateUserPassword, 
    validatePasswordMiddleware 
} from './validateUserPassword.js';

// You can add other middlewares here as needed
// For example:
// export { authMiddleware } from './auth.js';
// export { rateLimitMiddleware } from './rateLimit.js';
// export { corsMiddleware } from './cors.js';
// ...

// Default export for additional compatibility
export default {
    validateUserPassword,
    validatePasswordMiddleware
};
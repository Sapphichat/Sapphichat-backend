import bcrypt from 'bcrypt';

/**
 * Validates a password by comparing it with the stored hash
 * @param {string} plainPassword - The plain text password
 * @param {Object} user - The user object containing the password hash
 * @param {Object} res - The Express response object (optional, for timing attack protection)
 * @returns {Promise<boolean>} - Returns true if the password is valid, false otherwise
 */
export const validateUserPassword = async (plainPassword, user, res = null) => {
    try {
        // Protection against timing attacks - always run bcrypt even if user doesn't exist
        const hashToCompare = user.password || '$2b$10$invalidhashtopreventtimingattack';
        
        const isValid = await bcrypt.compare(plainPassword, hashToCompare);
        
        // If user doesn't exist, always return false
        if (!user.password) {
            return false;
        }
        
        return isValid;
    } catch (error) {
        // Log error if necessary
        if (res && res.locals && res.locals.logger) {
            res.locals.logger.error('Password validation error:', error);
        }
        return false;
    }
};

/**
 * Express middleware to validate a password
 * Uses password and user from req.body and req.user
 */
export const validatePasswordMiddleware = async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = req.user;
        
        if (!password) {
            return res.status(400).json({
                error: 'ERR_PASSWORD_REQUIRED',
                message: 'Password is required'
            });
        }
        
        if (!user) {
            return res.status(401).json({
                error: 'ERR_USER_REQUIRED',
                message: 'User authentication required'
            });
        }
        
        const isValid = await validateUserPassword(password, user, res);
        
        if (!isValid) {
            return res.status(401).json({
                error: 'ERR_INVALID_PASSWORD',
                message: 'Invalid password'
            });
        }
        
        // Password is valid, continue to next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'ERR_INTERNAL_SERVER',
            message: 'Internal server error during password validation'
        });
    }
};

export default validateUserPassword;
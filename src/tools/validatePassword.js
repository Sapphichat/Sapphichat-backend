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
        console.error('Password validation error:', error);
        return false;
    }
};

export default validateUserPassword;

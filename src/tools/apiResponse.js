/**
 * Utility functions for standardized API responses
 */

/**
 * Creates a success response following the API format
 * @param {*} data - The data to include in the response
 * @param {string} message - Optional success message
 * @returns {Object} Formatted success response
 */
export const successResponse = (data = null, message = null) => {
    const response = {
        success: true
    };
    
    if (message) {
        response.message = message;
    }
    
    if (data !== null) {
        response.data = data;
    }
    
    return response;
};

/**
 * Creates an error response following the API format
 * @param {string} error - The error message
 * @param {string} code - The error code
 * @param {*} data - Optional additional error data
 * @returns {Object} Formatted error response
 */
export const errorResponse = (error, code = null, data = null) => {
    const response = {
        success: false,
        error
    };
    
    if (code) {
        response.code = code;
    }
    
    if (data !== null) {
        response.data = data;
    }
    
    return response;
};

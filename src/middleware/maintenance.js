import configDb from '../tools/configDb.js';
import { errorResponse } from '../tools/apiResponse.js';

/**
 * Middleware to check if maintenance mode is enabled
 * If MAINTENANCE_MODE is true, returns a 503 error
 */
export const checkMaintenance = (req, res, next) => {
    if (configDb.MAINTENANCE_MODE === true) {
        return res.status(503).json(
            errorResponse(
                'Service temporarily unavailable for maintenance',
                'MAINTENANCE_MODE'
            )
        );
    }
    
    next();
};

export default checkMaintenance;
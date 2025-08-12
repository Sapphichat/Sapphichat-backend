import { Session, User } from '../models/index.js';
import { errorResponse } from '../tools/apiResponse.js';

/**
 * Middleware to verify authentication via token
 * Checks token validity in the database
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(
                errorResponse('Missing authentication token', 'MISSING_TOKEN')
            );
        }
        
        const token = authHeader.substring(7); // Remove "Bearer "
        
        if (!token) {
            return res.status(401).json(
                errorResponse('Invalid authentication token', 'INVALID_TOKEN')
            );
        }
        
        // Find session in database
        const session = await Session.findOne({
            where: { token },
            include: [{
                model: User,
                as: 'user'
            }]
        });
        
        if (!session) {
            return res.status(401).json(
                errorResponse('Session not found', 'SESSION_NOT_FOUND')
            );
        }
        
        // Check if session has not expired
        const now = new Date();
        if (session.expiresAt < now) {
            // Optional: delete expired session
            await session.destroy();
            
            return res.status(401).json(
                errorResponse('Session expired', 'SESSION_EXPIRED')
            );
        }
        
        // Check that user still exists
        if (!session.user) {
            return res.status(401).json(
                errorResponse('User not found', 'USER_NOT_FOUND')
            );
        }
        
        // Add user and session information to request
        req.user = session.user;
        req.session = session;
        
        next();
        
    } catch (error) {
        console.error('Error during authentication verification:', error);
        return res.status(500).json(
            errorResponse('Internal server error', 'INTERNAL_ERROR')
        );
    }
};

export default authenticate;

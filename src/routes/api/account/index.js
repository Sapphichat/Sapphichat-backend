// Core dependency
import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
// Import models
import User from '../../../models/User.js';
// Import middleware
import { validateUserPassword } from '../../../middleware/index.js';
// Import tools
import { generateUniqueId } from '../../../tools/generateId.js';

const router = express.Router();

// POST /api/account/register
router.post('/register', [
    body('username')
        .isLength({ min: 1 }).withMessage('Username must be at least 1 character long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain only letters, numbers, and underscores, and no spaces or special characters')
        .custom(value => value === value.toLowerCase()).withMessage('Username must be in lowercase'),
    body('displayname').isLength({ min: 3 }).withMessage('Displayname must be at least 3 characters long'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., !@#$%^&*)'),
    body('tos')
        .notEmpty().withMessage('Please allow our TOS to continue')
        .isBoolean().withMessage('TOS must be set to true')
],
registerLimiter, 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('ERR_VALIDATION', 'Validation failed', { errors: errors.array() }));
    }

    const { username, displayname, password, tos } = req.body;

    if (!configDb.allow_registration) {
        return res.status(403).json(errorResponse('ERR_REGISTRATION_DISABLED', 'Registration is currently disabled'));
    }

    if (!tos === true) {
        return res.status(400).json(errorResponse('ERR_TOS_REQUIRED', 'You must agree to our TOS'));
    }

    try {
        if (username) {
            existingUser = await User.findOne({ where: { username } });
        }

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json(errorResponse('ERR_USERNAME_IN_USE', 'Username already in use'));
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const generatedId = generateUniqueId();
        await User.create({
            id: generatedId,
            username,
            displayname,
            password: hashedPassword
        });
        res.status(201).json({ success: true, message: "Account created successfully" });
    } catch (error) {
        logger.error('Registration failed', {
            error: error.message,
            stack: error.stack,
            userId: req.user ? req.user.id : null
        });
        res.status(500).json(errorResponse('ERR_INTERNAL_SERVER'));
    }
});

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], loginLimiter, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('ERR_VALIDATION', 'Validation failed', { errors: errors.array() }));
    }

    const { username, password, twoFaCode } = req.body;

    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        let isValid = false;
        if (user) {
            if (user.isBanned) {
                return res.status(403).json(errorResponse('ERR_BANNED', 'Your account is banned.', { banReason: user.banReason || "No reason provided" }));
            }
            if (user.roleId === 'GUEST') {
                return res.status(403).json(errorResponse('ERR_GUEST_CANNOT_LOGIN', 'Guest accounts cannot log in. Please claim your account first.'));
            }
            isValid = await validateUserPassword(password, user, res);
        } else {
            await validateUserPassword(password, { password: '' }, res);
        }

        if (!user || !isValid) {
            return res.status(401).json(errorResponse('ERR_USERNAME_OR_PASSWORD_INCORRECT', 'Username or password is incorrect'));
        }

        if (user.isTwoFaEnabled) {
            if (!twoFaCode) {
                return res.status(400).json(errorResponse('ERR_2FA_REQUIRED', '2FA code is required'));
            }
            if (!verifyTwoFaCode(user.twoFaSecret, twoFaCode)) {
                return res.status(401).json(errorResponse('ERR_INVALID_2FA', 'Invalid 2FA code'));
            }
        }

        const authToken = crypto.randomBytes(64).toString('hex');
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + (config.session_duration * 1000));
        const generatedId = generateUniqueId();

        await Session.create({
            id: generatedId,
            token: authToken,
            userId: user.id,
            createdAt,
            expiresAt
        });
        
        await user.update({
            lastLoginAt: createdAt
        });

        res.json({ success: true, authToken });

    } catch (error) {
        logger.error('Registration failed', {
            error: error.message,
            stack: error.stack,
            userId: req.user ? req.user.id : null
        });
        res.status(500).json(errorResponse('ERR_INTERNAL_SERVER'));
    }
});

export default router;
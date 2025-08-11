// Core dependency
import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
// Import models
import User from '../../../models/User.js';
import Session from '../../../models/Session.js';
// Import tools
import { generateUniqueId, validateUserPassword, config, successResponse, errorResponse } from '../../../tools/index.js';

// Placeholder functions that need to be implemented
const configDb = { allow_registration: true }; // TODO: Get from database settings
const verifyTwoFaCode = (secret, code) => false; // TODO: Implement 2FA verification

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
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Validation failed', 'ERR_VALIDATION', { errors: errors.array() }));
    }

    const { username, displayname, password, tos } = req.body;

    if (!configDb.allow_registration) {
        return res.status(403).json(errorResponse('Registration is currently disabled', 'ERR_REGISTRATION_DISABLED'));
    }

    if (!tos === true) {
        return res.status(400).json(errorResponse('You must agree to our TOS', 'ERR_TOS_REQUIRED'));
    }

    try {
        let existingUser = null;
        if (username) {
            existingUser = await User.findOne({ where: { username } });
        }

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json(errorResponse('Username already in use', 'ERR_USERNAME_IN_USE'));
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const generatedId = generateUniqueId();
        await User.create({
            id: generatedId,
            username,
            displayname,
            password: hashedPassword,
            roleId: 'USER'
        });
        res.status(201).json(successResponse(null, "Account created successfully"));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error', 'ERR_INTERNAL_SERVER'));
    }
});

router.post('/login', [
    body('identity').notEmpty().withMessage('Identity is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Validation failed', 'ERR_VALIDATION', { errors: errors.array() }));
    }

    const { identity, password, twoFaCode } = req.body;

    try {
        const user = await User.findOne({
            where: {
                username: identity
            }
        });

        let isValid = false;
        if (user) {
            if (user.isBanned) {
                return res.status(403).json(errorResponse('Your account is banned.', 'ERR_BANNED', { banReason: user.banReason || "No reason provided" }));
            }
            if (user.roleId === 'GUEST') {
                return res.status(403).json(errorResponse('Guest accounts cannot log in. Please claim your account first.', 'ERR_GUEST_CANNOT_LOGIN'));
            }
            isValid = await validateUserPassword(password, user, res);
        } else {
            await validateUserPassword(password, { password: '' }, res);
        }

        if (!user || !isValid) {
            return res.status(401).json(errorResponse('Username or password is incorrect', 'ERR_USERNAME_OR_PASSWORD_INCORRECT'));
        }

        if (user.isTwoFaEnabled) {
            if (!twoFaCode) {
                return res.status(400).json(errorResponse('2FA code is required', 'ERR_2FA_REQUIRED'));
            }
            if (!verifyTwoFaCode(user.twoFaSecret, twoFaCode)) {
                return res.status(401).json(errorResponse('Invalid 2FA code', 'ERR_INVALID_2FA'));
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

        res.json(successResponse({ authToken }));

    } catch (error) {
        res.status(500).json(errorResponse('Internal server error', 'ERR_INTERNAL_SERVER'));
    }
});

export default router;
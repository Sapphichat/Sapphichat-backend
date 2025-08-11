// Core dependencies
import { config } from 'dotenv';
import express from 'express';

// Import routes
import accountRouter from './api/account/index.js';

const router = express.Router();

// /api route
router.get('/', (req, res) => {
    res.json(
        {
            success: true,
            data: {
                version: config.version
            }
        }
    );
});

router.use('/account', accountRouter);

export default router;
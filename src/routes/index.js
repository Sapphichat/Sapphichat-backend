// Core dependencies
import { config } from 'dotenv';
import express from 'express';
import configDb from '../tools/configDb.js';

// Import routes
import accountRouter from './api/account/index.js';

// Import middlewares
import { checkMaintenance } from '../middleware/index.js';

const router = express.Router();

// /api route
router.get('/', (req, res) => {
    res.json(
        {
            success: true,
            data: {
                version: config.version,
                maintenanceMode: configDb.MAINTENANCE_MODE,
                allowRegistration: configDb.ALLOW_REGISTRATION,
                serverState: configDb.SERVER_STATE

            }
        }
    );
});

router.use('/account', checkMaintenance, accountRouter);

export default router;
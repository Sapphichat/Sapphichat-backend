import express from 'express';
import testRouter from './test/test.js';

const router = express.Router();

// Utilisation du router de test
router.use('/test', testRouter);

export default router;
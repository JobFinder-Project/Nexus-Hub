import express from 'express';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
import userRoutes from './user.routes.js';
const router = express.Router();

router.use('/', authRoutes);
router.use('/', catalogRoutes);
router.use('/', userRoutes);

export default router;

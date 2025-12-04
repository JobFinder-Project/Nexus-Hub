import express from 'express';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
const router = express.Router();

/* router.get('/', (req, res) => {
  res.render('home', { title: 'Nexus Hub - Home' });
}); */

router.use('/', authRoutes);
router.use('/', catalogRoutes);

export default router;

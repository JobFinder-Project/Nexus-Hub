import express from 'express';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  renderAdminHome,
  renderAdminProducts,
  createPlataform,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard/admin', renderAdminHome);
router.get('/dashboard/admin/products', renderAdminProducts);

router.post('/admin/plataforms/create', createPlataform);

export default router;

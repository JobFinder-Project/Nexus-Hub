import express from 'express';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  renderAdminHome,
  renderAdminProducts,
  createPlataform,
  deletePromotion,
  createProduct,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard/admin', renderAdminHome);
router.get('/dashboard/admin/products', renderAdminProducts);

router.post('/admin/plataforms/create', createPlataform);
router.post('/admin/promotions/delete/:promotionId', deletePromotion);
router.post('/admin/products/create', createProduct);

export default router;

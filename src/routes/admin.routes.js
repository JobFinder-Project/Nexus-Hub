import express from 'express';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  renderAdminHome,
  renderAdminProducts,
  renderCategories,
  createCategory,
  renderPromotions,
  createPromotion,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard/admin-test', renderAdminHome);
router.get('/dashboard/admin/products', renderAdminProducts);

router.get('/dashboard/categories', renderCategories);
router.post('/dashboard/admin/categories/create', createCategory);

router.get('/dashboard/promotions', renderPromotions);
router.post('/dashboard/promotions/create', createPromotion);

export default router;

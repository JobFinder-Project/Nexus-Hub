import express from 'express';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  renderAdminHome,
  renderAdminProducts,
  createPlataform,
  deletePlataform,
  deletePromotion,
  createProduct,
  updateProduct,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard/admin', renderAdminHome);
router.get('/dashboard/admin/products', renderAdminProducts);

router.post('/admin/plataforms/create', createPlataform);
router.post('/admin/plataforms/delete/:plataformaId', deletePlataform);
router.post('/admin/promotions/delete/:promotionId', deletePromotion);
router.post('/admin/products/create', createProduct);
router.post('/admin/products/update', updateProduct);

export default router;

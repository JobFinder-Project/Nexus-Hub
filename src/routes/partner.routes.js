import express from 'express';
import { isPartner } from '../middlewares/roleMiddleware.js';
import {
  renderPartnerHome,
  renderPartnerProducts,
  createPromotion,
  createProduct,
} from '../controllers/partnerController.js';

const router = express.Router();

router.use(isPartner);

router.get('/dashboard/partner', renderPartnerHome);
router.get('/dashboard/partner/products', renderPartnerProducts);
router.post('/partner/promotions/create', createPromotion);
router.post('/partner/products/create', createProduct);

export default router;

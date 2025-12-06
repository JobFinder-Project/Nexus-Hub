import express from 'express';
import { isPartner } from '../middlewares/roleMiddleware.js';
import {
  renderPartnerHome,
  renderPartnerProducts,
  createPromotion,
} from '../controllers/partnerController.js';

const router = express.Router();

router.use(isPartner);

router.get('/dashboard/partner-test', renderPartnerHome);
router.get('/dashboard/partner/products', renderPartnerProducts);
router.post('/dashboard/partner/promotions/create', createPromotion);

export default router;
